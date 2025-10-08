"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  collection,
  getDocs,
  Timestamp,
  orderBy,
  limit,
  db,
} from "../lib/firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useAuth();
  const [readings, setReadings] = useState([]);
  const [motorStatus, setMotorStatus] = useState(false);
  const [tankLevel, setTankLevel] = useState(0);
  const [flowRate, setFlowRate] = useState(0);
  const [leakAlert, setLeakAlert] = useState(false);
  const [usageData, setUsageData] = useState([]);
  const [bill, setBill] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Get latest readings in real-time
    const q = query(
      collection(db, "readings"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const latest = snapshot.docs[0].data();
        setMotorStatus(latest.motorStatus || false);
        setTankLevel(latest.tankLevel || 0);
        setFlowRate(latest.flow || 0);

        // Simple leak detection
        setLeakAlert(latest.leakDetected || latest.flow > 100);
      }
    });

    // Get usage data for chart
    const fetchUsageData = async () => {
      const usageQ = query(
        collection(db, "readings"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(10)
      );

      const usageSnapshot = await getDocs(usageQ);
      const usage = usageSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            time:
              data.timestamp?.toDate().toLocaleTimeString() ||
              new Date().toLocaleTimeString(),
            flow: data.flow || 0,
          };
        })
        .reverse(); // Reverse to show chronological order

      setUsageData(usage);
    };

    fetchUsageData();

    // Calculate bill based on total flow
    const calculateBill = async () => {
      const billQ = query(
        collection(db, "bills"),
        where("userId", "==", user.uid)
      );
      const billSnapshot = await getDocs(billQ);

      if (billSnapshot.docs.length > 0) {
        setBill(billSnapshot.docs[0].data().amount);
      } else {
        // Create initial bill
        await addDoc(collection(db, "bills"), {
          userId: user.uid,
          amount: 0.0,
          date: Timestamp.now(),
        });
        setBill(0.0);
      }
    };

    calculateBill();

    return () => unsubscribe();
  }, [user]);

  const toggleMotor = async () => {
    if (readings.length > 0) {
      const latestReading = readings[0];
      await updateDoc(doc(db, "readings", latestReading.id), {
        motorStatus: !motorStatus,
      });
    } else {
      // Create a new reading if none exists
      await addDoc(collection(db, "readings"), {
        userId: user.uid,
        timestamp: Timestamp.now(),
        flow: flowRate,
        tankLevel: tankLevel,
        motorStatus: !motorStatus,
        pressure: 2.5,
        ph: 7.0,
        turbidity: 1.2,
        conductivity: 300,
      });
      setMotorStatus(!motorStatus);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-black p-8 font-sans">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold">Dashboard</h1>
          <Link
            href="/simulation"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open Simulation
          </Link>
        </div>

        {/* Leak Alert */}
        {leakAlert && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-800">Leak Detected!</h3>
                <p className="text-red-700 text-sm">
                  Abnormal water flow detected. Check your water system.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          {/* Tank Status */}
          <div className="border border-gray-300 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium mb-2">Tank Level</h2>
            <p className="text-3xl font-bold text-blue-600">{tankLevel}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${tankLevel}%` }}
              ></div>
            </div>
          </div>

          {/* Flow Rate */}
          <div className="border border-gray-300 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium mb-2">Flow Rate</h2>
            <p className="text-3xl font-bold text-purple-600">
              {flowRate} L/min
            </p>
            <p className="text-sm text-gray-600 mt-1">Current flow</p>
          </div>

          {/* Current Bill */}
          <div className="border border-gray-300 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium mb-2">Current Bill</h2>
            <p className="text-3xl font-bold text-green-600">
              ${bill.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Estimated</p>
          </div>
        </div>

        {/* Usage Chart */}
        <div className="border border-gray-300 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Flow Rate Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="flow"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Status */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">System Status</p>
            <p
              className={`font-semibold ${
                leakAlert ? "text-red-600" : "text-green-600"
              }`}
            >
              {leakAlert ? "Issue Detected" : "All Systems Normal"}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Last Update</p>
            <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Simulation Ready</p>
            <p className="font-semibold text-green-600">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

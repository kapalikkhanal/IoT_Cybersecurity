"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, doc, setDoc, collection, serverTimestamp } from "@/lib/firebase";

const Simulation = () => {
  const { user } = useAuth();
  const [simulation, setSimulation] = useState({
    tankLevel: 75,
    flowRate: 50,
    motorStatus: false,
    pressure: 2.5,
    ph: 7.0,
    turbidity: 1.2,
    conductivity: 300,
    temperature: 25,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [leakDetected, setLeakDetected] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    let interval;
    if (isRunning && user) {
      interval = setInterval(async () => {
        // Generate realistic fluctuations
        const newTankLevel = Math.max(
          0,
          Math.min(
            100,
            simulation.tankLevel + (simulation.motorStatus ? -0.5 : 0.2)
          )
        );

        const newFlowRate = simulation.motorStatus
          ? 45 + Math.random() * 20
          : Math.random() * 5;

        const updatedSimulation = {
          ...simulation,
          tankLevel: parseFloat(newTankLevel.toFixed(1)),
          flowRate: parseFloat(newFlowRate.toFixed(1)),
          pressure: parseFloat((2 + Math.random() * 1).toFixed(1)),
          ph: parseFloat((6.8 + Math.random() * 0.8).toFixed(1)),
          turbidity: parseFloat((0.8 + Math.random() * 0.8).toFixed(1)),
          conductivity: Math.floor(280 + Math.random() * 100),
          temperature: parseFloat((24 + Math.random() * 3).toFixed(1)),
        };

        setSimulation(updatedSimulation);

        // Check for leaks (sudden high flow when motor is off)
        if (!simulation.motorStatus && newFlowRate > 15) {
          setLeakDetected(true);
        } else {
          setLeakDetected(false);
        }

        // Save to Firestore
        await setDoc(
          doc(collection(db, "readings"), `${user.uid}_${Date.now()}`),
          {
            userId: user.uid,
            timestamp: serverTimestamp(),
            flow: updatedSimulation.flowRate,
            pressure: updatedSimulation.pressure,
            ph: updatedSimulation.ph,
            turbidity: updatedSimulation.turbidity,
            conductivity: updatedSimulation.conductivity,
            tankLevel: updatedSimulation.tankLevel,
            motorStatus: updatedSimulation.motorStatus,
            temperature: updatedSimulation.temperature,
            leakDetected: leakDetected,
          }
        );
      }, 2000); // Update every 2 seconds
    }

    return () => clearInterval(interval);
  }, [isRunning, simulation, user, leakDetected]);

  const toggleMotor = () => {
    setSimulation((prev) => ({
      ...prev,
      motorStatus: !prev.motorStatus,
    }));
  };

  const setTankLevel = (level) => {
    setSimulation((prev) => ({
      ...prev,
      tankLevel: Math.max(0, Math.min(100, level)),
    }));
  };

  const simulateLeak = () => {
    setSimulation((prev) => ({
      ...prev,
      flowRate: 120,
      motorStatus: false,
    }));
    setLeakDetected(true);
  };

  const resetLeak = () => {
    setLeakDetected(false);
    setSimulation((prev) => ({
      ...prev,
      flowRate: prev.motorStatus ? 50 : 2,
    }));
  };

  const startSimulation = () => {
    setIsRunning(true);
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulation({
      tankLevel: 75,
      flowRate: 50,
      motorStatus: false,
      pressure: 2.5,
      ph: 7.0,
      turbidity: 1.2,
      conductivity: 300,
      temperature: 25,
    });
    setLeakDetected(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            IoT Device Simulation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simulate real-time water monitoring sensors and devices. This data
            will sync with your dashboard in real-time.
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              onClick={startSimulation}
              disabled={isRunning}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▶ Start Simulation
            </button>
            <button
              onClick={stopSimulation}
              disabled={!isRunning}
              className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏸ Stop Simulation
            </button>
            <button
              onClick={resetSimulation}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
            >
              🔄 Reset
            </button>
          </div>

          <div className="flex justify-center items-center space-x-4">
            <div
              className={`px-4 py-2 rounded-lg font-medium ${
                isRunning
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              Status: {isRunning ? "Running" : "Stopped"}
            </div>
            {leakDetected && (
              <div className="px-4 py-2 bg-red-100 text-red-800 border border-red-300 rounded-lg font-medium animate-pulse">
                🔥 LEAK DETECTED!
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Device Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Device Controls
            </h2>

            {/* Motor Control */}
            <div className="mb-8 p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Water Pump Motor
                </h3>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    simulation.motorStatus
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {simulation.motorStatus ? "RUNNING" : "STOPPED"}
                </div>
              </div>
              <button
                onClick={toggleMotor}
                disabled={!isRunning}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {simulation.motorStatus ? "🛑 Stop Motor" : "▶ Start Motor"}
              </button>
            </div>

            {/* Tank Level Control */}
            <div className="mb-8 p-4 border border-gray-200 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tank Level
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0%</span>
                  <span className="font-medium">{simulation.tankLevel}%</span>
                  <span>100%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulation.tankLevel}
                  onChange={(e) => setTankLevel(parseInt(e.target.value))}
                  disabled={!isRunning}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex gap-2">
                  {[0, 25, 50, 75, 100].map((level) => (
                    <button
                      key={level}
                      onClick={() => setTankLevel(level)}
                      disabled={!isRunning}
                      className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {level}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Leak Simulation */}
            <div className="p-4 border border-gray-200 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Leak Simulation
              </h3>
              <div className="space-y-3">
                <button
                  onClick={simulateLeak}
                  disabled={!isRunning || leakDetected}
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💧 Simulate Water Leak
                </button>
                <button
                  onClick={resetLeak}
                  disabled={!leakDetected}
                  className="w-full py-3 px-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔧 Fix Leak
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Sensor Data */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sensor Readings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tank Level Visualization */}
              <div className="col-span-2 p-4 border border-gray-200 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Water Tank
                </h3>
                <div className="relative h-48 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-1000 ease-in-out"
                    style={{ height: `${simulation.tankLevel}%` }}
                  >
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">
                      {simulation.tankLevel}%
                    </div>
                  </div>
                  {/* Water waves animation */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-blue-300 opacity-50 animate-wave"></div>
                </div>
              </div>

              {/* Sensor Data Cards */}
              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-medium text-gray-700 mb-2">Flow Rate</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {simulation.flowRate} L/min
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-medium text-gray-700 mb-2">
                  Water Pressure
                </h4>
                <div className="text-2xl font-bold text-purple-600">
                  {simulation.pressure} bar
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-medium text-gray-700 mb-2">pH Level</h4>
                <div className="text-2xl font-bold text-green-600">
                  {simulation.ph}
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-medium text-gray-700 mb-2">Turbidity</h4>
                <div className="text-2xl font-bold text-yellow-600">
                  {simulation.turbidity} NTU
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-medium text-gray-700 mb-2">Conductivity</h4>
                <div className="text-2xl font-bold text-indigo-600">
                  {simulation.conductivity} μS/cm
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-medium text-gray-700 mb-2">Temperature</h4>
                <div className="text-2xl font-bold text-red-600">
                  {simulation.temperature}°C
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            How to Use This Simulation
          </h3>
          <ul className="text-blue-800 space-y-2 list-disc list-inside">
            <li>
              Click &quot;Start Simulation&quot; to begin generating real-time sensor data
            </li>
            <li>
              Control the water pump motor to see how it affects flow rate and
              tank level
            </li>
            <li>Adjust tank level manually or let it change automatically</li>
            <li>Simulate leaks to test the leak detection system</li>
            <li>All data syncs with your dashboard in real-time</li>
            <li>Switch to the Dashboard tab to see the data visualizations</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Simulation;

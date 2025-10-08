"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, setDoc, doc, auth, db } from "../lib/firebase"; // Added auth, db imports
import { useRouter } from "next/navigation";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting signup with:", { email, password }); // Debug log
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Pass auth
      const user = userCredential.user;
      console.log("User created:", user.uid); // Debug log
      await setDoc(doc(db, "users", user.uid), { email, createdAt: new Date() });
      console.log("User document created in Firestore"); // Debug log
      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Signup error:", error); // Debug log
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4 p-8 bg-white shadow-md rounded min-w-80">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="p-2 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-green-500 text-white rounded">Signup</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default Signup;
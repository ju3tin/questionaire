"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function JoinPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!name.trim()) return alert("Please enter your name");

    setLoading(true);
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("participantId", data.participantId);
      localStorage.setItem("sessionId", data.sessionId);

      router.push(`/live/${data.sessionId}`);
    } catch (err: any) {
      alert(err.message || "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Join Questionnaire
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Code: <span className="font-mono font-bold">{code}</span>
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full border rounded-xl px-4 py-3 mb-6 text-lg"
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        />

        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join"}
        </button>
      </div>
    </div>
  );
}

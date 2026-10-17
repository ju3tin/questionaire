"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(`/api/sessions/${sessionId}/results`);
      const data = await res.json();
      setResults(data.results || []);
      setStatus(data.status);
    };

    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl">
            Timed<span className="text-blue-600">Q</span>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">Results</h1>
        <p className="text-gray-500 mb-8">
          Status: <span className="uppercase font-medium">{status}</span>
        </p>

        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">#</th>
                <th className="text-left px-6 py-4 font-semibold">Name</th>
                <th className="text-left px-6 py-4 font-semibold">Time</th>
                <th className="text-left px-6 py-4 font-semibold">Answered</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No results yet
                  </td>
                </tr>
              )}
              {results.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4 font-medium">{r.name}</td>
                  <td className="px-6 py-4 font-mono">
                    {formatTime(r.totalTimeMs)}
                  </td>
                  <td className="px-6 py-4">{r.answeredCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// src/app/admin/sessions/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SessionItem {
  _id: string;
  code: string;
  status: "waiting" | "live" | "finished";
  questionnaireTitle: string;
  totalQuestions: number;
  participantCount: number;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleString();
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    waiting: "bg-yellow-100 text-yellow-800",
    live: "bg-green-100 text-green-800",
    finished: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/sessions/list");
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Back to Dashboard
          </Link>
          <div className="font-bold text-xl">
            Timed<span className="text-blue-600">Q</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Sessions</h1>
          <p className="text-gray-600 mt-1">
            Review past and live sessions
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border">
            <div className="text-5xl mb-4">📂</div>
            <h2 className="text-xl font-semibold mb-2">No sessions yet</h2>
            <p className="text-gray-500 mb-6">
              Start a session from one of your questionnaires
            </p>
            <Link
              href="/admin/questionnaires"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Questionnaires
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Questionnaire
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Code
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Participants
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Created
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{s.questionnaireTitle}</div>
                      <div className="text-xs text-gray-500">
                        {s.totalQuestions} questions
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold">{s.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-6 py-4">{s.participantCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {s.status !== "finished" && (
                        <Link
                          href={`/admin/session/${s._id}`}
                          className="inline-block px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Open Live
                        </Link>
                      )}
                      <Link
                        href={`/admin/sessions/${s._id}`}
                        className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
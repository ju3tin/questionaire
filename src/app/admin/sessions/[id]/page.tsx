// src/app/admin/sessions/[id]/page.tsx
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

export default function SessionReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/sessions/${id}/full`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!data?.session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Session not found
      </div>
    );
  }

  const { session, questionnaire, participants } = data;

  // Calculate times
  const rows = participants.map((p: any) => {
    let totalTimeMs = p.totalTimeMs;
    if (!totalTimeMs && p.answers?.length > 0) {
      const first = new Date(p.joinedAt).getTime();
      const last = new Date(
        p.answers[p.answers.length - 1].answeredAt
      ).getTime();
      totalTimeMs = last - first;
    }
    return {
      ...p,
      totalTimeMs: totalTimeMs || 0,
    };
  });

  rows.sort((a: any, b: any) => a.totalTimeMs - b.totalTimeMs);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/admin/sessions"
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Back to Sessions
          </Link>
          <div className="font-bold text-xl">
            Timed<span className="text-blue-600">Q</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header info */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            {questionnaire?.title || "Session Review"}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              Code: <span className="font-mono font-bold">{session.code}</span>
            </span>
            <span className="uppercase font-medium">{session.status}</span>
            <span>
              {participants.length} participant
              {participants.length !== 1 ? "s" : ""}
            </span>
            {session.startedAt && (
              <span>
                Started: {new Date(session.startedAt).toLocaleString()}
              </span>
            )}
            {session.endedAt && (
              <span>
                Ended: {new Date(session.endedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Results table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-10">
          <div className="px-6 py-4 border-b font-semibold">
            Participants & Times
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">#</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold">
                  Time
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold">
                  Answered
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No participants
                  </td>
                </tr>
              )}
              {rows.map((p: any, i: number) => (
                <tr key={p._id} className="border-t">
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3 font-medium">{p.name}</td>
                  <td className="px-6 py-3 font-mono">
                    {formatTime(p.totalTimeMs)}
                  </td>
                  <td className="px-6 py-3">
                    {p.answers?.length || 0} /{" "}
                    {questionnaire?.questions?.length || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Individual answers (expandable style) */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Detailed Answers</h2>

          {rows.map((p: any) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl border shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <span className="text-sm text-gray-500 font-mono">
                  {formatTime(p.totalTimeMs)}
                </span>
              </div>

              {p.answers?.length === 0 ? (
                <p className="text-gray-400 text-sm">No answers submitted</p>
              ) : (
                <div className="space-y-3">
                  {p.answers.map((a: any, idx: number) => {
                    const question =
                      questionnaire?.questions?.[a.questionIndex];
                    return (
                      <div
                        key={idx}
                        className="border-l-4 border-blue-500 pl-4 py-1"
                      >
                        <div className="text-sm text-gray-500 mb-1">
                          Q{a.questionIndex + 1}: {question?.text || "—"}
                        </div>
                        <div className="font-medium">{String(a.answer)}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(a.answeredAt).toLocaleTimeString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
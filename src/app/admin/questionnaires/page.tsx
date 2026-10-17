// src/app/admin/questionnaires/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Questionnaire {
  _id: string;
  title: string;
  questions: any[];
  createdAt: string;
  isActive: boolean;
}

export default function MyQuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      const res = await fetch("/api/questionnaires");
      const data = await res.json();
      setQuestionnaires(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (questionnaireId: string) => {
    setStartingId(questionnaireId);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaireId }),
      });

      const session = await res.json();
      if (!res.ok) throw new Error(session.error);

      router.push(`/admin/session/${session._id}`);
    } catch (err) {
      alert("Failed to start session");
    } finally {
      setStartingId(null);
    }
  };

  const deleteQuestionnaire = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/questionnaires/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setQuestionnaires((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert("Failed to delete questionnaire");
    } finally {
      setDeletingId(null);
    }
  };

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
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">My Questionnaires</h1>
            <p className="text-gray-600 mt-1">
              View, edit, start sessions, or delete your questionnaires
            </p>
          </div>
          <Link
            href="/admin/questionnaires/new"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            + Create New
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : questionnaires.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold mb-2">No questionnaires yet</h2>
            <p className="text-gray-500 mb-6">
              Create your first questionnaire to get started
            </p>
            <Link
              href="/admin/questionnaires/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Questionnaire
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {questionnaires.map((q) => (
              <div
                key={q._id}
                className="bg-white border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
              >
                <div>
                  <h2 className="text-lg font-semibold">{q.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {q.questions?.length || 0} questions · Created{" "}
                    {new Date(q.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => startSession(q._id)}
                    disabled={startingId === q._id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {startingId === q._id ? "Starting..." : "Start Session"}
                  </button>

                  <Link
                    href={`/admin/questionnaires/${q._id}/edit`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteQuestionnaire(q._id, q.title)}
                    disabled={deletingId === q._id}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === q._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
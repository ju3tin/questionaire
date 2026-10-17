"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminSessionPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/sessions/${id}/full`);
      const data = await res.json();
      if (res.ok) {
        setSession(data.session);
        setQuestionnaire(data.questionnaire);
        setParticipants(data.participants || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2500);
    return () => clearInterval(interval);
  }, [id]);

  const unlockNext = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${id}/unlock`, { method: "POST" });
      const data = await res.json();
      if (data.finished) {
        alert("Session finished!");
      }
      await loadData();
    } catch {
      alert("Failed to unlock next question");
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!confirm("End the session for everyone?")) return;
    await fetch(`/api/sessions/${id}/end`, { method: "POST" });
    await loadData();
  };

  if (!session || !questionnaire) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading session...
      </div>
    );
  }

  const currentQuestion =
    session.currentQuestionIndex >= 0
      ? questionnaire.questions[session.currentQuestionIndex]
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{questionnaire.title}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>
                Code:{" "}
                <span className="font-mono font-bold text-lg text-black">
                  {session.code}
                </span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs uppercase">
                {session.status}
              </span>
              <Link
                href={`/join/${session.code}`}
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                Open join link
              </Link>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={endSession}
              className="px-5 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              End Session
            </button>

            <button
              onClick={unlockNext}
              disabled={loading || session.status === "finished"}
              className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {session.currentQuestionIndex === -1
                ? "Start Questionnaire"
                : session.status === "finished"
                ? "Finished"
                : "Unlock Next Question →"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              {currentQuestion
                ? `Question ${session.currentQuestionIndex + 1} of ${
                    questionnaire.questions.length
                  }`
                : "Waiting to start"}
            </h2>

            {currentQuestion ? (
              <>
                <p className="text-xl mb-6">{currentQuestion.text}</p>

                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question"
                    className="max-h-72 rounded-xl mb-6 object-contain"
                  />
                )}

                {currentQuestion.videoUrl && (
                  <div className="aspect-video mb-6">
                    <iframe
                      src={
                        currentQuestion.videoUrl.includes("youtube")
                          ? currentQuestion.videoUrl.replace(
                              "watch?v=",
                              "embed/"
                            )
                          : currentQuestion.videoUrl
                      }
                      className="w-full h-full rounded-xl"
                      allowFullScreen
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">
                Click “Start Questionnaire” to unlock the first question.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            Participants ({participants.length})
          </h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {participants.length === 0 && (
              <p className="text-gray-400 text-sm">No one has joined yet</p>
            )}

            {participants.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">
                    Answered {p.answers?.length || 0} /{" "}
                    {questionnaire.questions.length}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {p.answers?.length === questionnaire.questions.length
                    ? "Done"
                    : "In progress"}
                </div>
              </div>
            ))}
          </div>

          {session.status === "finished" && (
            <Link
              href={`/results/${id}`}
              className="mt-6 block text-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

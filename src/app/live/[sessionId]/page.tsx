"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LivePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [status, setStatus] = useState<"waiting" | "live" | "finished">(
    "waiting"
  );
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [question, setQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const participantId =
    typeof window !== "undefined"
      ? localStorage.getItem("participantId")
      : null;

  const previousIndex = useRef(-1);

  useEffect(() => {
    if (!sessionId) return;

    const fetchCurrent = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}/current`);
        const data = await res.json();
        if (!res.ok) return;

        setStatus(data.status);
        setTotalQuestions(data.totalQuestions);
        setQuestionIndex(data.currentQuestionIndex);
        setQuestion(data.question);

        if (data.currentQuestionIndex !== previousIndex.current) {
          setAnswer("");
          setSubmitted(false);
          previousIndex.current = data.currentQuestionIndex;
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrent();
    const interval = setInterval(fetchCurrent, 2000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleSubmit = async () => {
    if (!answer || !participantId || submitted) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/participants/${participantId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIndex, answer }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "finished") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-3">Thank you!</h1>
          <p className="text-gray-600 mb-8">
            You have completed the questionnaire.
          </p>
          <button
            onClick={() => router.push(`/results/${sessionId}`)}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  if (questionIndex === -1 || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-2">Waiting for the admin...</h1>
          <p className="text-gray-500">The questionnaire will start shortly</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
          <span>
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="font-medium text-blue-600">
            {submitted ? "Answered" : "Your turn"}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <h2 className="text-2xl font-semibold mb-6 leading-relaxed">
            {question.text}
          </h2>

          {question.imageUrl && (
            <div className="mb-6">
              <img
                src={question.imageUrl}
                alt="Question media"
                className="w-full max-h-80 object-contain rounded-xl"
              />
            </div>
          )}

          {question.videoUrl && (
            <div className="aspect-video mb-6 rounded-xl overflow-hidden">
              <iframe
                src={
                  question.videoUrl.includes("youtube.com") ||
                  question.videoUrl.includes("youtu.be")
                    ? question.videoUrl
                        .replace("watch?v=", "embed/")
                        .replace("youtu.be/", "youtube.com/embed/")
                    : question.videoUrl
                }
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-xl font-medium text-green-600 mb-2">
                Answer submitted!
              </p>
              <p className="text-gray-500">
                Waiting for the admin to unlock the next question...
              </p>
            </div>
          ) : (
            <div>
              {question.type === "text" && (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                  placeholder="Type your answer here..."
                  className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                />
              )}

              {question.type === "multiple" && (
                <div className="space-y-3 mb-6">
                  {question.options?.map((opt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setAnswer(opt)}
                      className={`w-full text-left px-5 py-4 rounded-xl border text-lg transition ${
                        answer === opt
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {question.type === "rating" && (
                <div className="flex justify-center gap-3 mb-8">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setAnswer(String(num))}
                      className={`w-14 h-14 rounded-full text-xl font-bold transition ${
                        answer === String(num)
                          ? "bg-blue-600 text-white scale-110"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!answer || loading}
                className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Submitting..." : "Submit Answer"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

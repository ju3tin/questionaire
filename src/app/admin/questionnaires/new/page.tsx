"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  text: string;
  type: "text" | "multiple" | "rating";
  options: string[];
  imageUrl: string;
  videoUrl: string;
}

export default function CreateQuestionnairePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", type: "text", options: [], imageUrl: "", videoUrl: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", type: "text", options: [], imageUrl: "", videoUrl: "" },
    ]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Title is required");
    if (questions.some((q) => !q.text.trim())) {
      return alert("All questions must have text");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/questionnaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, questions }),
      });

      if (!res.ok) throw new Error("Failed to create");

      const data = await res.json();

      // Start a session immediately
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaireId: data._id }),
      });

      const session = await sessionRes.json();
      router.push(`/admin/session/${session._id}`);
    } catch (err) {
      alert("Error creating questionnaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800">
            ← Back to Dashboard
          </Link>
          <div className="font-bold">
            Timed<span className="text-blue-600">Q</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Create Questionnaire</h1>

        <div className="mb-8">
          <label className="block font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 bg-white"
            placeholder="e.g. Customer Feedback 2026"
          />
        </div>

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="border rounded-xl p-6 mb-6 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Question {qIndex + 1}</h3>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              )}
            </div>

            <textarea
              value={q.text}
              onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-4"
              rows={3}
              placeholder="Enter your question..."
            />

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={q.imageUrl}
                onChange={(e) =>
                  updateQuestion(qIndex, "imageUrl", e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2"
                placeholder="https://example.com/image.jpg"
              />
              {q.imageUrl && (
                <img
                  src={q.imageUrl}
                  alt="Preview"
                  className="mt-3 max-h-48 rounded-lg object-contain"
                />
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Video URL (optional)
              </label>
              <input
                type="url"
                value={q.videoUrl}
                onChange={(e) =>
                  updateQuestion(qIndex, "videoUrl", e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2"
                placeholder="YouTube, Vimeo or direct video link"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={q.type}
                onChange={(e) =>
                  updateQuestion(qIndex, "type", e.target.value as any)
                }
                className="border rounded-lg px-4 py-2"
              >
                <option value="text">Text</option>
                <option value="multiple">Multiple Choice</option>
                <option value="rating">Rating (1-5)</option>
              </select>
            </div>

            {q.type === "multiple" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Options</label>
                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder={`Option ${oIndex + 1}`}
                  />
                ))}
                <button
                  onClick={() => addOption(qIndex)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add option
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="flex gap-4">
          <button
            onClick={addQuestion}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50 bg-white"
          >
            + Add Question
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create & Start Session"}
          </button>
        </div>
      </main>
    </div>
  );
}

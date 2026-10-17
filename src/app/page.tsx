import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">
            Timed<span className="text-blue-600">Q</span>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/admin"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Live moderated questionnaires
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
          Run timed questionnaires
          <br />
          <span className="text-blue-600">you fully control</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Participants can only move to the next question when you allow it.
          Perfect for research, assessments, workshops and live data collection.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={session ? "/admin" : "/login"}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
          >
            {session ? "Open Dashboard" : "Create your first questionnaire"}
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 border border-gray-300 rounded-xl text-lg font-medium hover:bg-gray-50 transition"
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for controlled data collection
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Unlike normal forms, you decide exactly when participants see the
              next question.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔒",
                color: "bg-blue-100 text-blue-600",
                title: "Admin-controlled flow",
                desc: "Participants can only advance when you unlock the next question. Perfect for live sessions and fair assessments.",
              },
              {
                icon: "🖼️",
                color: "bg-green-100 text-green-600",
                title: "Images & Videos",
                desc: "Add images or embed YouTube/Vimeo videos to any question. Make your questionnaires richer and more engaging.",
              },
              {
                icon: "⏱️",
                color: "bg-purple-100 text-purple-600",
                title: "Times & Results",
                desc: "See exactly how long each participant took. Get a clear ranked list at the end of every session.",
              },
              {
                icon: "⚡",
                color: "bg-orange-100 text-orange-600",
                title: "Real-time updates",
                desc: "Watch answers come in live. Know exactly who has responded before you unlock the next question.",
              },
              {
                icon: "🔐",
                color: "bg-pink-100 text-pink-600",
                title: "Social Login",
                desc: "Sign in securely with Google, GitHub or LinkedIn. No passwords to manage.",
              },
              {
                icon: "📊",
                color: "bg-indigo-100 text-indigo-600",
                title: "Live dashboard",
                desc: "Control everything from one clean admin panel. Start, unlock questions, and end sessions with one click.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 border shadow-sm"
              >
                <div
                  className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-2xl mb-5`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create",
                desc: "Build your questionnaire with text, images and videos.",
              },
              {
                step: "2",
                title: "Share code",
                desc: "Participants join with a simple session code.",
              },
              {
                step: "3",
                title: "Control",
                desc: "You decide when each question is unlocked.",
              },
              {
                step: "4",
                title: "Results",
                desc: "See everyone who completed it and their times.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to run your first controlled questionnaire?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Set up in minutes. No complex tools required.
          </p>
          <Link
            href={session ? "/admin" : "/login"}
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-50 transition"
          >
            {session ? "Go to Dashboard" : "Get Started Free"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-lg">
            Timed<span className="text-blue-600">Q</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TimedQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

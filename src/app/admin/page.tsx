import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl">
            Timed<span className="text-blue-600">Q</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session.user?.name || session.user?.email}
            </span>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-10">
          Create questionnaires and run live controlled sessions.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/admin/questionnaires/new"
            className="bg-white border rounded-2xl p-8 hover:shadow-md transition group"
          >
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
              Create Questionnaire
            </h2>
            <p className="text-gray-600">
              Build a new questionnaire with text, images and videos.
            </p>
          </Link>

          <Link
  href="/admin/questionnaires"
  className="bg-white border rounded-2xl p-8 hover:shadow-md transition group"
>
  <div className="text-4xl mb-4">📋</div>
  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
    My Questionnaires
  </h2>
  <p className="text-gray-600">
    View and manage your existing questionnaires
  </p>
</Link>
<Link
  href="/admin/sessions"
  className="bg-white border rounded-2xl p-8 hover:shadow-md transition group"
>
  <div className="text-4xl mb-4">📂</div>
  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
    Sessions
  </h2>
  <p className="text-gray-600">
    Review past and live sessions, times and answers
  </p>
</Link>
        </div>
      </main>
    </div>
  );
}

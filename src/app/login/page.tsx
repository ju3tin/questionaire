
import { Suspense } from "react";
import LoginPage from "./LoginPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading login...
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
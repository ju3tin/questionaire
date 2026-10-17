import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import Questionnaire from "@/models/Questionnaire";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const session = await Session.findById(id);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const questionnaire = await Questionnaire.findById(session.questionnaireId);
    if (!questionnaire) {
      return NextResponse.json(
        { error: "Questionnaire not found" },
        { status: 404 }
      );
    }

    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex >= questionnaire.questions.length) {
      session.status = "finished";
      session.endedAt = new Date();
      await session.save();
      return NextResponse.json({ finished: true });
    }

    session.currentQuestionIndex = nextIndex;
    if (session.status === "waiting") {
      session.status = "live";
      session.startedAt = new Date();
    }
    await session.save();

    return NextResponse.json({
      currentQuestionIndex: nextIndex,
      question: questionnaire.questions[nextIndex],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

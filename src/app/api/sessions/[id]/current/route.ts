import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import Questionnaire from "@/models/Questionnaire";

export async function GET(
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

    const currentQuestion =
      session.currentQuestionIndex >= 0
        ? questionnaire.questions[session.currentQuestionIndex]
        : null;

    return NextResponse.json({
      status: session.status,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: questionnaire.questions.length,
      question: currentQuestion,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

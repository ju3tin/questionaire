import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import Questionnaire from "@/models/Questionnaire";
import Participant from "@/models/Participant";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const session = await Session.findById(id);
    if (!session) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const questionnaire = await Questionnaire.findById(session.questionnaireId);
    const participants = await Participant.find({ sessionId: id }).sort({
      joinedAt: 1,
    });

    return NextResponse.json({
      session,
      questionnaire,
      participants,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

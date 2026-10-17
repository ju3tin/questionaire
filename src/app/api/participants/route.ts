import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import Participant from "@/models/Participant";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, name } = await req.json();

    const session = await Session.findOne({ code: code.toUpperCase() });
    if (!session) {
      return NextResponse.json({ error: "Invalid code" }, { status: 404 });
    }

    if (session.status === "finished") {
      return NextResponse.json(
        { error: "Session has ended" },
        { status: 400 }
      );
    }

    const participant = await Participant.create({
      sessionId: session._id,
      name,
    });

    return NextResponse.json({
      participantId: participant._id,
      sessionId: session._id,
      currentQuestionIndex: session.currentQuestionIndex,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

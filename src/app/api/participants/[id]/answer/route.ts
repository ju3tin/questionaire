import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Participant from "@/models/Participant";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { questionIndex, answer } = await req.json();

    const participant = await Participant.findById(id);
    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    const alreadyAnswered = participant.answers.some(
      (a) => a.questionIndex === questionIndex
    );
    if (alreadyAnswered) {
      return NextResponse.json({ error: "Already answered" }, { status: 400 });
    }

    participant.answers.push({
      questionIndex,
      answer,
      answeredAt: new Date(),
    });

    await participant.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

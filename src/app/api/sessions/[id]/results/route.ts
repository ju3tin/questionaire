import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Participant from "@/models/Participant";
import Session from "@/models/Session";

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

    const participants = await Participant.find({ sessionId: id });

    const results = participants
      .map((p) => {
        let totalTimeMs = p.totalTimeMs;

        if (!totalTimeMs && p.answers.length > 0) {
          const first = p.joinedAt.getTime();
          const last = p.answers[p.answers.length - 1].answeredAt.getTime();
          totalTimeMs = last - first;
        }

        return {
          name: p.name,
          totalTimeMs: totalTimeMs || 0,
          answeredCount: p.answers.length,
          finishedAt: p.finishedAt,
        };
      })
      .sort((a, b) => a.totalTimeMs - b.totalTimeMs);

    return NextResponse.json({
      status: session.status,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// src/app/api/sessions/list/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import Questionnaire from "@/models/Questionnaire";
import Participant from "@/models/Participant";

export async function GET() {
  try {
    await connectDB();

    const sessions = await Session.find()
      .sort({ createdAt: -1 })
      .lean();

    const enriched = await Promise.all(
      sessions.map(async (s) => {
        const questionnaire = await Questionnaire.findById(s.questionnaireId)
          .select("title questions")
          .lean();

        const participantCount = await Participant.countDocuments({
          sessionId: s._id,
        });

        return {
          _id: s._id,
          code: s.code,
          status: s.status,
          currentQuestionIndex: s.currentQuestionIndex,
          startedAt: s.startedAt,
          endedAt: s.endedAt,
          createdAt: s.createdAt,
          questionnaireTitle: questionnaire?.title || "Unknown",
          totalQuestions: questionnaire?.questions?.length || 0,
          participantCount,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
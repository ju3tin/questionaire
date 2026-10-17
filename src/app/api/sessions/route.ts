import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { questionnaireId } = await req.json();

    const code = nanoid(6).toUpperCase();

    const session = await Session.create({
      questionnaireId,
      code,
      status: "waiting",
      currentQuestionIndex: -1,
    });

    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

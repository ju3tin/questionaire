import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Questionnaire from "@/models/Questionnaire";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const questionnaire = await Questionnaire.create({
      title: body.title,
      questions: body.questions,
    });

    return NextResponse.json(questionnaire);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const questionnaires = await Questionnaire.find().sort({ createdAt: -1 });
    return NextResponse.json(questionnaires);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

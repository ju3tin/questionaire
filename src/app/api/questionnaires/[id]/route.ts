// src/app/api/questionnaires/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Questionnaire from "@/models/Questionnaire";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const questionnaire = await Questionnaire.findById(id);
    if (!questionnaire) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(questionnaire);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const questionnaire = await Questionnaire.findByIdAndUpdate(
      id,
      {
        title: body.title,
        questions: body.questions,
      },
      { new: true }
    );

    if (!questionnaire) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(questionnaire);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const questionnaire = await Questionnaire.findByIdAndDelete(id);
    if (!questionnaire) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
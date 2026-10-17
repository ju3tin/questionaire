import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const session = await Session.findByIdAndUpdate(
      id,
      {
        status: "finished",
        endedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAnswer {
  questionIndex: number;
  answer: string | number;
  answeredAt: Date;
}

export interface IParticipant extends Document {
  sessionId: Types.ObjectId;
  name: string;
  joinedAt: Date;
  finishedAt?: Date;
  totalTimeMs?: number;
  answers: IAnswer[];
}

const AnswerSchema = new Schema({
  questionIndex: { type: Number, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
  answeredAt: { type: Date, default: Date.now },
});

const ParticipantSchema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  name: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  finishedAt: Date,
  totalTimeMs: Number,
  answers: [AnswerSchema],
});

export default mongoose.models.Participant ||
  mongoose.model<IParticipant>("Participant", ParticipantSchema);

import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISession extends Document {
  questionnaireId: Types.ObjectId;
  code: string;
  status: "waiting" | "live" | "finished";
  currentQuestionIndex: number;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
}

const SessionSchema = new Schema({
  questionnaireId: {
    type: Schema.Types.ObjectId,
    ref: "Questionnaire",
    required: true,
  },
  code: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["waiting", "live", "finished"],
    default: "waiting",
  },
  currentQuestionIndex: { type: Number, default: -1 },
  startedAt: Date,
  endedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Session ||
  mongoose.model<ISession>("Session", SessionSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  text: string;
  type: "text" | "multiple" | "rating";
  options?: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface IQuestionnaire extends Document {
  title: string;
  questions: IQuestion[];
  isActive: boolean;
  createdAt: Date;
}

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "multiple", "rating"],
    default: "text",
  },
  options: [String],
  imageUrl: String,
  videoUrl: String,
});

const QuestionnaireSchema = new Schema({
  title: { type: String, required: true },
  questions: [QuestionSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Questionnaire ||
  mongoose.model<IQuestionnaire>("Questionnaire", QuestionnaireSchema);

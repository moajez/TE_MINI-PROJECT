import mongoose, { Schema, Document, Types } from "mongoose";

interface ISyllabus extends Document {
  user: Types.ObjectId;
  courseName: string;
  courseCode: string;
  syllabus: { _id: string; topic: string }[];
}

const SyllabusSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseName: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, trim: true },
    syllabus: [
      {
        _id: { type: String, required: true },
        topic: { type: String, required: true },
        number: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ISyllabus>("Syllabus", SyllabusSchema);
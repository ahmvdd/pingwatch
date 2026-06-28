import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMonitor extends Document {
  userId: Types.ObjectId;
  name: string;
  url: string;
  interval: number;
  isActive: boolean;
  lastStatus: "UP" | "DOWN" | "UNKNOWN";
  lastCheckedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MonitorSchema = new Schema<IMonitor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    interval: { type: Number, default: 5, min: 1, max: 60 },
    isActive: { type: Boolean, default: true },
    lastStatus: {
      type: String,
      enum: ["UP", "DOWN", "UNKNOWN"],
      default: "UNKNOWN",
    },
    lastCheckedAt: { type: Date },
  },
  { timestamps: true }
);

const MonitorModel =
  (mongoose.models.Monitor as mongoose.Model<IMonitor>) ||
  mongoose.model<IMonitor>("Monitor", MonitorSchema);

export default MonitorModel;

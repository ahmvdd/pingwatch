import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICheck extends Document {
  monitorId: Types.ObjectId;
  status: "UP" | "DOWN";
  statusCode: number;
  responseTime: number;
  error?: string;
  checkedAt: Date;
}

const CheckSchema = new Schema<ICheck>({
  monitorId: { type: Schema.Types.ObjectId, ref: "Monitor", required: true, index: true },
  status: { type: String, enum: ["UP", "DOWN"], required: true },
  statusCode: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  error: { type: String },
  checkedAt: { type: Date, default: Date.now, index: true },
});

CheckSchema.index({ monitorId: 1, checkedAt: -1 });

const CheckModel =
  (mongoose.models.Check as mongoose.Model<ICheck>) ||
  mongoose.model<ICheck>("Check", CheckSchema);

export default CheckModel;

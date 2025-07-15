import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporter: Schema.Types.ObjectId;
  reportedUser?: Schema.Types.ObjectId;
  reportedListing?: Schema.Types.ObjectId;
  reason: string;
  details?: string;
  status: 'open' | 'closed';
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>({
  reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUser: { type: Schema.Types.ObjectId, ref: 'User' },
  reportedListing: { type: Schema.Types.ObjectId, ref: 'Listing' },
  reason: { type: String, required: true },
  details: { type: String },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReport>('Report', ReportSchema); 
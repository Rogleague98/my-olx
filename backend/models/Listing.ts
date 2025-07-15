import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  location: string; // city
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ListingSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  location: { type: String, required: true }, // city
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IListing>('Listing', ListingSchema);
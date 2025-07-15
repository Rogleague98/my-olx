import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePic: string;
  bio: string;
  createdAt: Date;
  favorites: mongoose.Types.ObjectId[];
  isAdmin: boolean;
  verified: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profilePic: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  isAdmin: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
});

export default mongoose.model<IUser>('User', UserSchema);

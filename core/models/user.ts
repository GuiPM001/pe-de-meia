import { Schema, models, model } from 'mongoose';
import { Types } from "mongoose";
import { Document } from "mongoose";
import { Profile } from '../types/Profile';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true
  },
  savingTarget: {
    type: Number,
  },
  dailyCost: {
    type: Number,
  }
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);

export type ProfileDocument = Profile & Document<Types.ObjectId>;

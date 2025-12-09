import { Schema, models, model } from 'mongoose';

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
  password: {
    type: String,
    required: [true, 'Senha é obrigatória']
  },
  savingTarget: {
    type: Number,
  },
  dailyCost: {
    type: Number,
  }
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);

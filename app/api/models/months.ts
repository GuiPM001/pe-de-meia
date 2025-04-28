import mongoose, { model, models } from 'mongoose';

const MonthSchema = new mongoose.Schema({
  monthBalance: { type: Number, required: true },
  isUser: { type: String, required: true },
  idMounth: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Months = models.Months || model('Months', MonthSchema);

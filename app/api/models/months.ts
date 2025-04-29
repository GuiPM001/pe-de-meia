import mongoose, { model, models } from 'mongoose';

const MonthSchema = new mongoose.Schema({
  monthBalance: { type: Number, required: true },
  idUser: { type: String, required: true },
  idMonth: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Months = models.Months || model('Months', MonthSchema);

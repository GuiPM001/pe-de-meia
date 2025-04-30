import { model, models, Schema } from "mongoose";

const MonthSchema = new Schema({
  balance: { type: Number, required: true },
  id: { type: Date, required: true },
  idUser: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Months = models.Months || model("Months", MonthSchema);

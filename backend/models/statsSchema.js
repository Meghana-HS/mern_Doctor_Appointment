import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  totalAppointments: { type: Number, default: 0 },
  totalDoctors: { type: Number, default: 0 },
});

export const Stats = mongoose.model("Stats", statsSchema);

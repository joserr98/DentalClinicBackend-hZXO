import mongoose from "mongoose";

const Appointment = mongoose.model(
  "Appointment",
  new mongoose.Schema(
    {
      client: {
        type: String,
        required: true,
      },
      dentist: {
        type: String,
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now
      },
      date: {
        type: Date,
        required: true,
        unique: true
      },
      type: {
        type: String,
        required: true
      }
    },
    { versionKey: false }
  )
);

export default Appointment
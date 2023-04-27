import mongoose from "mongoose";

const Appointment = mongoose.model(
  "Appointment",
  new mongoose.Schema(
    {
      type: {
        type: String,
        required: true
      },
      client: {
        type: String,
        required: true,
      },
      dentist: {
        type: String,
        required: true,
      },
      start_date: {
        type: Date,
        required: true,
      },
      end_date: {
        type: Date,
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now
      },
      edited_at: {
        type: Date,
        default: Date.now
      }
    },
    { versionKey: false }
  )
);

export default Appointment
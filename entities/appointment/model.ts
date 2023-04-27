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
        type: mongoose.Types.ObjectId,
        required: true,
      },
      dentist: {
        type: mongoose.Types.ObjectId,
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
      },
      updated_at: {
        type: Date,
      },
      deleted_at: {
        type: Date,
      }
    },
    { versionKey: false }
  )
);

export default Appointment
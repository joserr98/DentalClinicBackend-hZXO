import Appointment from "./model.js";
import config from "../../core/conf.js";

const getDateInAMonth = () => {
    const currentDate = Date.now();
    const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    const futureDate = new Date(currentDate + oneMonthInMilliseconds);
    return futureDate;
  }

export const createAppointment = async (data) => {
    data.date = getDateInAMonth();
    const appointment = new Appointment(data);
    return await appointment.save();
};

export const deleteAppointment = async (id) => {
    const appointment = await Appointment.findOne({ _id: id });
    if (appointment) {
      return await Appointment.deleteOne({ _id: id });
    }
  };
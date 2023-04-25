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
    const user = new Appointment(data);
    return await user.save();
};
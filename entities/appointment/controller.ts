import Appointment from "./model.js";
import config from "../../core/conf.js";

export const createAppointment = async (data) => {
  const appointments = await Appointment.findOne                     
    ({$and: [{$or: [{dentist: data.dentist}, {client: data.client}]},
      {$or: [{ $and: [{ start_date: { $gte: data.start_date }}, {start_date: { $lte: data.end_date } }] },
             { $and: [{ start_date: { $lt: data.start_date }}, {end_date: { $gt: data.end_date } }] },
             { $and: [{ end_date: { $gte: data.start_date } }, { end_date: { $lte: data.end_date}}]}]}]})
  if (appointments) throw new Error ("UNAVAILABLE_DATE")
  const appointment = new Appointment(data);
  return await appointment.save();

};

export const deleteAppointment = async (id) => {
  const appointment = await Appointment.findOne({ _id: id });
  if (appointment) {
    return await Appointment.deleteOne({ _id: id });
  }
};

export const modifyAppointment = async (req) => {
  const appointment = await Appointment.findOne({ _id: req.params.id });
  if (!appointment) throw new Error("NOT_FOUND");
  req.body.date = Date.now;
  await Appointment.replaceOne({ _id: req.params.id }, req.body);
  return await appointment.save();
};

// const convertDate = (fullDate) => {
//   let splitDate = fullDate.split(" ");
//   let date = splitDate[0].split("/");
//   let time = splitDate[1].split(":");
//   let dd = date[0];
//   let mm = date[1];
//   let yyyy = date[2];
//   let hh = time[0];
//   let min = time[1];
//   let fecha = new Date(yyyy,dd,mm,hh,min);
//   return fecha
// }

// const getDateInAMonth = () => {
//   const currentDate = Date.now();
//   const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
//   const futureDate = new Date(currentDate + oneMonthInMilliseconds);
//   return futureDate;
// }

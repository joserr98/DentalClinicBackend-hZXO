import Appointment from "./model.js";
import config from "../../core/conf.js";

export const listAppointment = async (data) => {
  const query = Object.keys(data.query);
  const appointmentTypeRegex = new RegExp(data.query.type, "i");
  const startDate = new Date(data.query.start_date);
  const endDate = new Date(data.query.end_date);
  const filter = {
    deleted_at: null,
    ...data.query.client && { client: data.query.client },
    ...data.query.dentist && { dentist: data.query.dentist },
    ...data.query.type && { type: appointmentTypeRegex },
    ...data.query.start_date && { start_date: { $lte: startDate } },
    ...data.query.end_date && { end_date: { $gt: endDate } },
    ...data.token.role === "client" && { client: data.token.id },
    ...data.token.role === "dentist" && {},
  };
  const proyection = { type: 1, dentist: 1, start_date: 1, end_date: 1 }
  const populateOptions = [
    { path: 'client', select: ['name', 'surname'] },
    { path: 'dentist', select: ['name', 'surname'] }
  ]
  return await Appointment.find(filter, proyection)
    .populate(populateOptions)
    .sort({'start_date': 1});
};

export const detailedAppointment = async (data) => {
  
  const appointment = await Appointment.findOne({ _id: data.params.id});
  if(!appointment) throw new Error('NO_APPOINTMENT')
  if(data.token.role == 'dentist'){
    return {appointment}
  } else
  if(data.token.role == 'client' && data.token.id == appointment.client){
    return {appointment}
  }

};

export const createAppointment = async (data) => {
  const { body, token } = data;
  const { dentist, client, start_date, end_date } = body;
  const appointmentExists = await Appointment.findOne({
    $or: [
      { dentist },
      { client },
    ],
    $and: [
      {
        $or: [
          { start_date: { $gte: start_date, $lt: end_date } },
          { end_date: { $gt: start_date, $lte: end_date } },
          { $and: [ { start_date: { $lte: start_date } }, { end_date: { $gte: end_date } } ] }
        ]
      }
    ]
  });
  if (appointmentExists) {
    throw new Error("UNAVAILABLE_DATE");
  }
  if (token.role === "client") {
    body.client = token.id;
  }
  if (token.role === "dentist") {
    body.dentist = token.id;
  }
  body.created_at = new Date();
  const appointment = new Appointment(body);
  return await appointment.save();
};

export const deleteAppointment = async (req) => {
  const appointment = await Appointment.findOne({ _id: req.params.id });
  if (!appointment) throw new Error("NO_APPOINTMENT");
  req.body.deleted_at = new Date();
  req.body.client = req.token.id;
  await Appointment.replaceOne({ _id: req.params.id }, req.body);
  return await appointment.save();
};

export const modifyAppointment = async (req) => {
  const appointment = await Appointment.findOne({ _id: req.params.id });
  if (!appointment) throw new Error("NO_APPOINTMENT");
  req.body.updated_at = new Date();
  req.body.client = req.token.id;
  await Appointment.replaceOne({ _id: req.params.id }, req.body);
  return await appointment.save();
};

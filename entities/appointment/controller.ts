import Appointment from "./model.js";
import config from "../../core/conf.js";

export const listAppointment = async (data) => {
  const appointmentTypeRegex = new RegExp(data.body.type, 'i');
  const appointmentClientRegex = new RegExp(data.body.client, 'i');
  const appointmentDentistRegex = new RegExp(data.body.dentist, 'i');
  if(data.token.role == 'client'){
    if (!data.body.name && !data.body.client && !data.body.dentist && !data.body.start_date && !data.body.end_date){
      return await Appointment.find({_id: data.token.id, deleted_at: null}, { type: 1, start_date: 1, dentist: 1 });
    }
    if (data.body.type) {
        return await Appointment.find({_id: data.token.id, type: appointmentTypeRegex })
    } 
    if (data.body.client) {
        return await Appointment.find({_id: data.token.id, client: appointmentClientRegex })
    } 
    if (data.body.dentist) {
        return await Appointment.find({_id: data.token.id, dentist: appointmentDentistRegex })
    } 
    if(data.body.start_date && data.body.end_date){
      return await Appointment.find({_id: data.token.id}, {$and: [{start_date: {$lt: data.body.start_date}}, {start_date: {$gt: data.body.end_date}}]})
    }
    if (data.body.start_date && !data.body.end_date){
        return await Appointment.find({_id: data.token.id}, {start_date: {$lt: data.body.start_date}})
    }
    if (data.body.end_date && !data.body.start_date){
      return await Appointment.find({_id: data.token.id}, {start_date: {$gt: data.body.end_date}})
    }
  } else {
    if (!data.body.name && !data.body.client && !data.body.dentist && !data.body.start_date && !data.body.end_date){
      return await Appointment.find({}, { type: 1, start_date: 1, dentist: 1 });
    }
    if (data.body.type) {
        return await Appointment.find({type: appointmentTypeRegex })
    } 
    if (data.body.client) {
        return await Appointment.find({client: appointmentClientRegex })
    } 
    if (data.body.dentist) {
        return await Appointment.find({dentist: appointmentDentistRegex })
    } 
    if(data.body.start_date && data.body.end_date){
      return await Appointment.find({}, {$and: [{start_date: {$lt: data.body.start_date}}, {start_date: {$gt: data.body.end_date}}]})
    }
    if (data.body.start_date && !data.body.end_date){
        return await Appointment.find({}, {start_date: {$lt: data.body.start_date}})
    }
    if (data.body.end_date && !data.body.start_date){
      return await Appointment.find({}, {start_date: {$gt: data.body.end_date}})
    }
  }

}

export const createAppointment = async (data) => {
  const appointments = await Appointment.findOne                     
    ({$and: [{$or: [{dentist: data.body.dentist}, {client: data.body.client}]},
      {$or: [{ $and: [{ start_date: { $gte: data.body.start_date }}, {start_date: { $lte: data.body.end_date } }] },
             { $and: [{ start_date: { $lt: data.body.start_date }}, {end_date: { $gt: data.body.end_date } }] },
             { $and: [{ end_date: { $gte: data.body.start_date } }, { end_date: { $lte: data.body.end_date}}]}]}]})
  if (appointments) throw new Error ("UNAVAILABLE_DATE")
  if(data.token.role === 'client'){
    data.body.client = data.token.id
  }
  data.body.created_at = new Date();
  const appointment = new Appointment(data.body);
  return await appointment.save();

};

export const deleteAppointment = async (req) => {
  const appointment = await Appointment.findOne({ _id: req.params.id });
  if (!appointment) throw new Error("NOT_FOUND");
  req.body.deleted_at = new Date();
  req.body.client = req.token.id
  await Appointment.replaceOne({ _id: req.params.id }, req.body);
  return await appointment.save();
};
// const appointment = await Appointment.findOne({ _id: id });
// if (appointment) {
//   return await Appointment.deleteOne({ _id: id });
// }

export const modifyAppointment = async (req) => {
  const appointment = await Appointment.findOne({ _id: req.params.id });
  if (!appointment) throw new Error("NOT_FOUND");
  req.body.updated_at = new Date();
  req.body.client = req.token.id
  await Appointment.replaceOne({ _id: req.params.id }, req.body);
  return await appointment.save();
};
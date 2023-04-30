import Appointment from "./model.js";
import config from "../../core/conf.js";

export const listAppointment = async (data) => {
  const query = Object.keys(data.query);
  const appointmentTypeRegex = new RegExp(data.query.type, "i");
  const appointmentClientRegex = new RegExp(data.query.client, "i");
  const appointmentDentistRegex = new RegExp(data.query.dentist, "i");
  const startDate = new Date(data.query.start_date);
  const endDate = new Date(data.query.end_date);
  const proyection = { type: 1, dentist: 1, start_date: 1, end_date: 1 }
  const populateOptions = [
    { path: 'client', select: ['name', 'surname'] },
    { path: 'dentist', select: ['name', 'surname'] }
  ]
  if (data.token.role == "client") {
    if (query.length < 1) {
      return await Appointment.find(
        { client: data.token.id, deleted_at: null},
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});
    }
    if (data.query.type) {
      return await Appointment.find(
        {
          $and: [
            {
              client: data.token.id,
              type: appointmentTypeRegex,
              deleted_at: null,
            },
          ],
        },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.dentist) {
      return await Appointment.find(
        {
          $and: [
            {
              client: data.token.id,
              dentist: appointmentDentistRegex,
              deleted_at: null,
            },
          ],
        },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.start_date && data.query.end_date) {
      return await Appointment.find(
        {
          $and: [
            { client: data.token.id },
            { deleted_at: null },
            {
              $and: [
                {
                  start_date: { $gte: startDate },
                  end_date: { $lt: endDate },
                },
              ],
            },
          ],
        },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.start_date) {
      return await Appointment.find(
        {
          $and: [
            {
              client: data.token.id,
              start_date: { $gte: startDate },
              deleted_at: null,
            },
          ],
        },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.end_date) {
      return await Appointment.find(
        {
          $and: [
            {
              client: data.token.id,
              start_date: { $gte: endDate },
              deleted_at: null,
            },
          ],
        },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
  } 
  if (data.token.role == "dentist") {
    if (query.length < 1) {
      return await Appointment.find(
        { deleted_at: null },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.type) {
      return await Appointment.find(
        { $and: [{ type: appointmentTypeRegex }, { deleted_at: null }] },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.client) {
      return await Appointment.find(
        { $and: [{ client: appointmentClientRegex }, { deleted_at: null }] },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.dentist) {
      return await Appointment.find(
        { $and: [{ dentist: appointmentDentistRegex }, { deleted_at: null }] },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.start_date && data.query.end_date) {
      return await Appointment.find(
        {
          $and: [
            { start_date: { $lt: startDate } },
            { start_date: { $gt: endDate } },
            { deleted_at: null },
          ],
        },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.start_date) {
      return await Appointment.find(
        { $and: [{ start_date: { $lt: startDate } }, { deleted_at: null }] },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
    if (data.query.end_date) {
      return await Appointment.find(
        { $and: [{ start_date: { $gt: endDate } }, { deleted_at: null }] },
        proyection
      )
      .populate(populateOptions)
      .sort({'start_date': 1});;
    }
  }
};

export const detailedAppointment = async (data) => {
  
  const appointment = await Appointment.findOne({ _id: data.params.id});
  if(!appointment) throw new Error('NO_APPOINTMENT_FOUND')
  if(data.token.role == 'dentist'){
    return {appointment}
  } else
  if(data.token.role == 'client' && data.token.id == appointment.client){
    return {appointment}
  }

};

export const createAppointment = async (data) => {
  const appointments = await Appointment.findOne({
    $and: [
      { $or: [{ dentist: data.body.dentist }, { client: data.body.client }] },
      {
        $or: [
          {
            $and: [
              { start_date: { $gte: data.body.start_date } },
              { start_date: { $lt: data.body.end_date } },
            ],
          },
          {
            $and: [
              { start_date: { $lte: data.body.start_date } },
              { end_date: { $gte: data.body.end_date } },
            ],
          },
          {
            $and: [
              { end_date: { $gt: data.body.start_date } },
              { end_date: { $lt: data.body.end_date } },
            ],
          },
        ],
      },
    ],
  });
  if (appointments) throw new Error("UNAVAILABLE_DATE");
  if (data.token.role === "client") {
    data.body.client = data.token.id;
  }
  if (data.token.role === "dentist") {
    data.body.dentist = data.token.id;
  }
  data.body.created_at = new Date();
  const appointment = new Appointment(data.body);
  return await appointment.save();
};

export const deleteAppointment = async (req) => {
  const appointment = await Appointment.findOne({ _id: req.params.id });
  if (!appointment) throw new Error("NOT_FOUND");
  req.body.deleted_at = new Date();
  req.body.client = req.token.id;
  await Appointment.replaceOne({ _id: req.params.id }, req.body);
  return await appointment.save();
};

export const modifyAppointment = async (req) => {
  const appointment = await Appointment.findOne({ _id: req.params.id });
  if (!appointment) throw new Error("NOT_FOUND");
  req.body.updated_at = new Date();
  req.body.client = req.token.id;
  await Appointment.replaceOne({ _id: req.params.id }, req.body);
  return await appointment.save();
};

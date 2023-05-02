import User from "./model.js";
import bcrypt from "bcrypt";
import config from "../../core/conf.js";
import jwt from "jsonwebtoken";

export const userList = async (req) => {
  const query = Object.keys(req.query)
  const regExpLastname = new RegExp(req.query.lastname, "i");
  const regExpName = new RegExp(req.query.name, "i");
  const filter = {
    deleted_at: null,
    ...(req.query.name && { name: regExpName }),
    ...(req.query.lastname && { lastname: regExpLastname }),
    ...(req.token.role === "client" && { _id: req.token.id }),
    ...(req.token.role === "dentist" && {}),
  };
  const proyection = { name: 1, lastname: 1, phone_number: 1, email: 1 }
  return await User.find(filter,proyection);
} 

export const userListByID = async (req) => {
  if (req.token.role == "client" && req.params.id == req.token.id) {
    return User.findById(
      { _id: req.params.id },
      { name: 1, lastname: 1, phone_number: 1, email: 1, password: 1 }
    );
  } else if (req.token.role == "dentist") {
    return User.findById(
      { _id: req.params.id },
      { created_at: 0, deleted_at: 0, updated_at: 0 }
    );
  } else throw new Error("USER_NOT_FOUND");
};

export const updateUser = async (data) => {
  if (data.token.role === "client" && data.params.id === data.token.id) {
    const user = await User.findOne({ _id: data.params.id });
    if (data.body.role !== "client") {
      throw new Error("SERVICE NOT ALLOW");
    }
    data.body.password = await bcrypt.hash(
      data.body.password,
      config.SALT_ROUND
    );
    data.body.updated_at = new Date();
    const updateUser = await User.findOneAndUpdate(
      { _id: data.params.id },
      { $set: data.body },
      { returnDocument: "after" }
    );
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    return updateUser;
  } else if (data.token.role === "dentist") {
    const user = await User.findById(data.params.id);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    data.body.password = await bcrypt.hash(
      data.body.password,
      config.SALT_ROUND
    );
    data.body.updated_at = new Date();
    const updatedUser = await User.findOneAndUpdate(
      { _id: data.params.id },
      { $set: data.body },
      { returnDocument: "after" }
    );
    return updatedUser;
  }
};

export const createUser = async (data) => {
  if (!data.password || data.password.lenght < 5)
    throw new Error("Invalid Password");
  data.password = await bcrypt.hash(data.password, config.SALT_ROUND);
  data.created_at = new Date();
  return User.create(data);
};

export const login = async (data) => {
  const user = await User.findOne({ email: data.email, deleted_at: null });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (!(await bcrypt.compare(data.password, user.password))) return null;
  const token = jwt.sign({ id: user._id, role: user.role }, config.SECRET, {
    expiresIn: "24h",
  });
  return { token };
};

export const deleteUser = async (data) => {
  if (data.token.role === "client" && data.params.id === data.token.id) {
    const user = await User.findOne({ _id: data.params.id });
    data.body.deleted_at = new Date();
    const updateUser = await User.findByIdAndUpdate(
      { _id: data.params.id },
      { $set: data.body },
      { returnDocument: "after" }
    );
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    return updateUser;
  } else if (data.token.role === "dentist") {
    const user = await User.findById(data.params.id);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    data.body.deleted_at = new Date();
    const updatedUser = await User.findByIdAndUpdate(
      { _id: data.params.id },
      { $set: data.body },
      { returnDocument: "after" }
    );
    return updatedUser;
  }
};

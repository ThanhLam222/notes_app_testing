import User from "../models/User.js";

export const createAdminUser = async () => {
  const userFound = await User.findOne({ email: "admin@localhost" });

  if (userFound) return;

  const newUser = new User({
    name: "admin",
    email: "admin@localhost",
  });

  newUser.password = await newUser.encryptPassword("adminpassword");

  const admin = await newUser.save();

  console.log("Admin user created", admin);
};

export const createUser = async () => {
  const userFound = await User.findOne({ email: "userB@gmail.com" });

  if (userFound) return;

  const newUser = new User({
    name: "userB",
    email: "userB@gmail.com",
  });

  newUser.password = await newUser.encryptPassword("userpassword");

  const userB = await newUser.save();

  console.log("UserB created", userB);
};

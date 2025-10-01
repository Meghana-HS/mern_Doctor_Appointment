import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";   // ✅ Correct import
import cloudinary from "cloudinary";

// ===== Patient Registration =====
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  let { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;

  firstName = firstName?.trim();
  lastName = lastName?.trim();
  email = email?.trim();
  password = password?.trim();

  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });

  generateToken(user, "User Registered!", 200, res);   // ✅ Fixed
});

// ===== Login =====
export const login = catchAsyncErrors(async (req, res, next) => {
  let { email, password } = req.body;

  email = email?.trim();
  password = password?.trim();

  if (!email || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Email Or Password!", 400));

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) return next(new ErrorHandler("Invalid Email Or Password!", 400));

  generateToken(user, "Login Successfully!", 201, res);   // ✅ Fixed
});

// ===== Add New Admin =====
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  let { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;

  firstName = firstName?.trim();
  lastName = lastName?.trim();
  email = email?.trim();
  password = password?.trim();

  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });

  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

// ===== Add New Doctor =====
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }

  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }

  let { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } = req.body;

  firstName = firstName?.trim();
  lastName = lastName?.trim();
  email = email?.trim();
  password = password?.trim();

  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) return next(new ErrorHandler("Doctor With This Email Already Exists!", 400));

  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500));
  }

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

// ===== Get All Doctors =====
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({ success: true, doctors });
});

// ===== Delete Doctor =====
export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await User.findOne({ _id: id, role: "Doctor" });
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }

  if (doctor.docAvatar && doctor.docAvatar.public_id) {
    await cloudinary.uploader.destroy(doctor.docAvatar.public_id);
  }

  await doctor.deleteOne();

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
  });
});

// ===== Get User Details =====
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});

// ===== Logout Admin =====
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      maxAge: 0,
    })
    .json({ success: true, message: "Admin Logged Out Successfully." });
});

// ===== Logout Patient =====
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      maxAge: 0,
    })
    .json({ success: true, message: "Patient Logged Out Successfully." });
});

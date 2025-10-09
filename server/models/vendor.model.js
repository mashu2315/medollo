// import mongoose from "mongoose";

// const vendorSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     licenseNumber: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     contactEmail: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     contactNumber: {
//       type: String,
//     },
//     address: {
//       type: String,
//     },
//     medicinesSupplied: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Medicine", // connect vendor to medicines
//       },
//     ],
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const Vendor = mongoose.model("Vendor", vendorSchema);
// export default Vendor;


import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  address: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactNumber: { type: String },
  medicinesSupplied: [{ type: String }], // <-- store names directly
});


const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;

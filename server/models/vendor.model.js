

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

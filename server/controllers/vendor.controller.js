const Vendor = require("../models/vendor.model.js");

//  Get all vendors
const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("medicinesSupplied");
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Create vendor
const createVendor = async (req, res) => {
  try {
    const { name, licenseNumber, address, contactEmail, contactNumber, medicinesSupplied } = req.body;

    // Validate required fields
    if (!name || !licenseNumber || !address || !contactEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure medicinesSupplied is an array
    const medicinesArray = Array.isArray(medicinesSupplied)
      ? medicinesSupplied
      : typeof medicinesSupplied === "string"
      ? medicinesSupplied.split(",").map((m) => m.trim()).filter((m) => m)
      : [];

    const vendor = new Vendor({
      name,
      licenseNumber,
      address,
      contactEmail,
      contactNumber: contactNumber || "",
      medicinesSupplied: medicinesArray,
    });

    const savedVendor = await vendor.save();
    res.status(201).json(savedVendor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating vendor", error: err.message });
  }
};

//  Get vendor by ID
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate("medicinesSupplied");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Update vendor
const updateVendor = async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json(updatedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//  Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getVendors,
  createVendor,
  getVendorById,
  updateVendor,
  deleteVendor
};

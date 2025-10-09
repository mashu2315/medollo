const express = require("express");
const { getVendors, createVendor, getVendorById, updateVendor, deleteVendor } = require("../controllers/vendor.controller.js");

const router = express.Router();

router.get("/", getVendors);
router.post("/", createVendor); // <-- this must match frontend POST
router.get("/:id", getVendorById);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

module.exports = router;

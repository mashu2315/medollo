import React, { useEffect, useState } from "react";
import AnimatedBackground from '../components/ui/AnimatedBackground';

const VendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    address: "",
    contactEmail: "",
    contactNumber: "",
    medicinesSupplied: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch vendors from backend
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/vendors`);
      const data = await res.json();
      setVendors(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          medicinesSupplied: formData.medicinesSupplied
            ? formData.medicinesSupplied.split(",").map((m) => m.trim())
            : [],
        }),
      });

      if (!res.ok) throw new Error("Failed to save vendor");
      setFormData({
        name: "",
        licenseNumber: "",
        address: "",
        contactEmail: "",
        contactNumber: "",
        medicinesSupplied: "",
      });

      // Refetch vendors to update list
      await fetchVendors();
    } catch (err) {
      console.error(err);
      alert("Error saving vendor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <AnimatedBackground />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
        <div className="container-custom py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-darkblue mb-2">Vendor Network</h1>
          <p className="text-gray-600 max-w-2xl">Partner with Medollo to supply authentic medicines across India. Add new vendors and explore our trusted partners below.</p>
        </div>
      </div>

      <div className="container-custom py-8 grid lg:grid-cols-2 gap-8">
        {/* Vendor Form */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-darkblue">Add Vendor</h2>
            <p className="text-sm text-gray-500 mt-1">Provide vendor details to onboard quickly.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Vendor Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., HealthCare Pharma"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g., LIC-XXXX-2025"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Medicines Supplied</label>
                <input
                  type="text"
                  name="medicinesSupplied"
                  value={formData.medicinesSupplied}
                  onChange={handleChange}
                  placeholder="Comma separated: Paracetamol, Amoxicillin, ..."
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Tip: Use commas to add multiple medicines.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition flex items-center justify-center"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Add Vendor'
              )}
            </button>
          </form>
        </div>

        {/* Vendors List */}
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-semibold text-darkblue">Our Vendors</h2>
            {!loading && (
              <span className="text-sm text-gray-500">{vendors.length} total</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-5 rounded-xl border bg-white/60 backdrop-blur shadow animate-pulse">
                  <div className="h-5 w-1/2 bg-gray-200 rounded" />
                  <div className="mt-3 h-3 w-2/3 bg-gray-100 rounded" />
                  <div className="mt-2 h-3 w-1/3 bg-gray-100 rounded" />
                  <div className="mt-5 h-20 bg-gray-50 rounded" />
                </div>
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="p-8 text-center rounded-xl border bg-white/70 backdrop-blur">
              <p className="text-gray-600">No vendors yet. Add your first vendor using the form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vendors.map((vendor) => (
                <div
                  key={vendor._id}
                  className="p-5 rounded-xl border bg-white/80 backdrop-blur shadow hover:shadow-lg transition group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-xl text-darkblue group-hover:text-primary transition-colors">{vendor.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">License: {vendor.licenseNumber}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">Verified</span>
                  </div>
                  <p className="text-sm mt-2 text-gray-700">{vendor.address}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a href={`mailto:${vendor.contactEmail}`} className="text-sm text-blue-600 hover:underline">{vendor.contactEmail}</a>
                    {vendor.contactNumber && <span className="text-sm text-gray-600">• {vendor.contactNumber}</span>}
                  </div>

                  <h4 className="text-sm font-semibold mt-4 text-gray-700">Medicines Supplied</h4>
                  {vendor.medicinesSupplied?.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {vendor.medicinesSupplied.map((med, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100"
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No medicines listed</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorPage;

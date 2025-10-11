import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCartIcon,
  HeartIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useMedicine } from "../../context/MedicineContext";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const RandomMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setSelectedMedicine } = useMedicine();

  useEffect(() => {
    const fetchRandomMedicines = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/random/med`
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        // Keep same structure as /api/medicines
        setMedicines(
          data.map((med) => ({
            _id: med._id,
            name: med.name,
            brand_name: med.brand_name,
            product_url: med.product_url || null,
            image_url:
              med.imageUrl ||
              med.image_url ||
              "https://placehold.co/160x160/FEE2E2/DC2626?text=No+Image",
            mrp: med.mrp || null,
            regularPrice: med.regularPrice || null,
            memberPrice: med.memberPrice || null,
            manufacturer: med.manufacturer || null,
            perUnit: med.perUnit || null,
            composition: med.composition || null,
            pack_size: med.pack_size || null,
            description: med.description || null,
            scraped_at: med.scraped_at || null,
            suggestions: med.suggestions || [],
          }))
        );
      } catch (err) {
        console.error("Error fetching random medicines:", err);
        setError("Failed to load random medicines. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRandomMedicines();
  }, []);

  if (loading)
    return (
      <div className="text-center p-10">
        <div className="animate-spin mx-auto h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Loading random medicines...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-4xl mx-auto mt-8">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowRightIcon className="h-4 w-4 mr-1" /> Try Again
        </button>
      </div>
    );

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      >
        {medicines.map((med) => (
          <motion.div
            key={med._id}
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => {
              setSelectedMedicine(med); // Save full details in context
              navigate(`/medicine/${med._id}`);
            }}
          >
            <img
              src={med.image_url}
              alt={med.name}
              className="w-full h-28 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/160x160/FEE2E2/DC2626?text=No+Image";
              }}
            />
            <div className="p-2">
              <h3 className="font-medium text-sm mb-0.5 line-clamp-1">
                {med.name}
              </h3>
              <p className="text-xs text-gray-500 mb-0.5">{med.brand_name}</p>
              <div className="flex items-center mb-1.5">
                <span className="text-sm font-bold text-primary mr-1">
                  ₹{med.regularPrice || med.memberPrice || "N/A"}
                </span>
                {med.mrp && (
                  <span className="text-xs text-gray-500 line-through">
                    ₹{med.mrp}
                  </span>
                )}
              </div>
              <button className="w-full bg-secondary hover:bg-secondary/90 text-white py-1 text-xs rounded transition-colors">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RandomMedicines;

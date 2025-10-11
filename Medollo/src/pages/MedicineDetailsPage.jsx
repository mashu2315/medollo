
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useMedicine } from "../context/MedicineContext";
import { useCart } from "../context/CartContext";
import FlaskConicalIcon from "../components/FlaskConicalIcon";

const MedicineDetailsPage = () => {
  const navigate = useNavigate();
  const { selectedMedicine } = useMedicine();
  const { addToCart, isLoggedIn } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!selectedMedicine) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded-lg max-w-4xl mx-auto mt-10 text-center">
        <h3 className="font-bold mb-2 text-lg">No Medicine Selected</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please go back and select a medicine to view its details.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Home
        </button>
      </div>
    );
  }

  const details = selectedMedicine;
  const suggestions = details.suggestions || [];

  // ---------- Helpers ----------
  const parseNumber = (v) => {
    if (v == null) return NaN;
    if (typeof v === "number") return v;
    const cleaned = String(v).replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
    return isNaN(n) ? NaN : n;
  };

  const formatINR = (n) =>
    isNaN(n) ? "N/A" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  // Try multiple possible keys that might contain prices
  const mrp = parseNumber(details.mrp ?? details.MRP ?? details.mrp_value ?? details.mrpPrice ?? details.mrp_price ?? details.price);
  const regularPrice = parseNumber(details.regularPrice ?? details.regular_price ?? details.price ?? details.regular);
  const memberPrice = parseNumber(details.memberPrice ?? details.member_price ?? details.discountPrice ?? details.discount_price ?? details.salePrice);

  // Select the effective per-unit price (prefer lowest valid price)
  const candidatePrices = [memberPrice, parseNumber(details.discountPrice), regularPrice, mrp].filter((p) => !isNaN(p) && p > 0);
  const effectivePrice = candidatePrices.length ? Math.min(...candidatePrices) : NaN;

  const totalMrp = isNaN(mrp) ? null : mrp * quantity;
  const totalEffective = isNaN(effectivePrice) ? null : effectivePrice * quantity;
  const perUnitDisplay = !isNaN(effectivePrice) ? formatINR(effectivePrice) : "N/A";

  const savingsPerUnit = !isNaN(mrp) && !isNaN(effectivePrice) && mrp > effectivePrice ? (mrp - effectivePrice) : 0;
  const savingsTotal = savingsPerUnit * quantity;
  const savingsPercent = (!isNaN(mrp) && mrp > 0 && savingsPerUnit > 0) ? Math.round((savingsPerUnit / mrp) * 100) : 0;

  // ---------- Handlers ----------
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: `/medicine/${details._id || details.id || details.name}`,
          message: "Please log in to add medicines to your cart.",
        },
      });
      return;
    }

    // Normalize product object: ensure id and normalized price fields
    const normalized = {
      ...details,
      id: details.id || details._id || details.product_id || details.name,
      price: !isNaN(regularPrice) ? regularPrice : (!isNaN(mrp) ? mrp : 0),
      discountPrice: !isNaN(memberPrice) ? memberPrice : (!isNaN(details.discountPrice) ? parseNumber(details.discountPrice) : undefined),
      mrp: !isNaN(mrp) ? mrp : undefined,
    };

    addToCart(normalized, quantity); // addToCart returns boolean in your context but we just call it here
    // Optionally show a tiny UI confirmation here (toast / inline message)
  };

  const handleOrderNow = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: "/cart",
          message: "Please log in to order medicines.",
        },
      });
      return;
    }

    const normalized = {
      ...details,
      id: details.id || details._id || details.product_id || details.name,
      price: !isNaN(regularPrice) ? regularPrice : (!isNaN(mrp) ? mrp : 0),
      discountPrice: !isNaN(memberPrice) ? memberPrice : (!isNaN(details.discountPrice) ? parseNumber(details.discountPrice) : undefined),
      mrp: !isNaN(mrp) ? mrp : undefined,
    };

    addToCart(normalized, quantity);
    navigate("/cart");
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-2xl">
      {/* Back button */}
      <button
        onClick={() => navigate("/products")}
        className="mb-6 flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Search
      </button>

      {/* Header */}
      <div className="flex items-center space-x-4 border-b pb-4 mb-4">
        <FlaskConicalIcon className="h-10 w-10 text-primary flex-shrink-0" />
        <h1 className="text-3xl font-bold text-gray-800">{details.name}</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Image + controls */}
        <div className="flex flex-col items-center md:col-span-1">
          {details.image_url ? (
            <img
              src={details.image_url}
              alt={details.name}
              className="w-40 h-auto object-cover rounded-lg shadow-md mb-4"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/160x160/FEE2E2/DC2626?text=No+Image";
              }}
            />
          ) : (
            <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">No Image</div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center space-x-3 mt-2 w-full">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 border rounded"
            >
              -
            </button>
            <div className="px-4 py-2 border rounded min-w-[40px] text-center">{quantity}</div>
            <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 border rounded">
              +
            </button>
          </div>

          {/* Add / Order */}
          <div className="flex flex-col w-full gap-3 mt-4">
            <button onClick={handleAddToCart} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-all font-semibold">
              Add to Cart
            </button>
            <button onClick={handleOrderNow} className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-secondary/90 transition-all font-semibold">
              Order Now
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-4">
          <p><strong>Brand:</strong> {details.brand_name || "N/A"}</p>
          <p><strong>Manufacturer:</strong> {details.manufacturer || "N/A"}</p>
          <p><strong>Pack Size / Per Unit:</strong> {details.perUnit || details.pack || "N/A"}</p>
          <p><strong>Composition:</strong> <span className="italic">{details.composition || "N/A"}</span></p>
          <p><strong>Description:</strong> {details.description || "No description available."}</p>

          <div className="mt-4 p-4 bg-green-50 rounded-lg shadow-inner">
            <p className="font-semibold text-lg text-green-700 mb-2">Price Details (per unit)</p>

            <p><strong>MRP:</strong> <span className="text-red-600 line-through">{!isNaN(mrp) ? formatINR(mrp) : "N/A"}</span></p>

            <p><strong>Regular Price:</strong> <span className="text-green-700 font-bold">{!isNaN(regularPrice) ? formatINR(regularPrice) : "N/A"}</span></p>

            <p><strong>Member / Discount Price:</strong> <span className="text-primary font-bold">{!isNaN(memberPrice) ? formatINR(memberPrice) : ( !isNaN(details.discountPrice) ? formatINR(parseNumber(details.discountPrice)) : "N/A" )}</span></p>

            <div className="mt-3">
              <p><strong>Selected unit price:</strong> {perUnitDisplay}</p>
              <p><strong>Total for {quantity}:</strong> { !isNaN(totalEffective) ? formatINR(totalEffective) : "N/A" }</p>

              {savingsPerUnit > 0 && (
                <p className="text-sm text-green-700 mt-1">
                  You save {formatINR(savingsPerUnit)} per unit ({savingsPercent}%); total savings {formatINR(savingsTotal)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Medicines */}
      {suggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Suggested Medicines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {suggestions.map((item, index) => (
              <a
                key={index}
                href={item.product_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center text-center"
              >
                <img
                  src={item.image_url || "https://placehold.co/120x120/F3F4F6/6B7280?text=No+Image"}
                  alt={item.name || "Medicine"}
                  className="w-24 h-24 object-cover rounded-md mb-3"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/120x120/FEE2E2/DC2626?text=No+Image";
                  }}
                />
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.name || "Unknown Medicine"}</h3>
                {item.mrp && <p className="text-sm text-gray-600">MRP: <span className="font-medium">₹{item.mrp}</span></p>}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineDetailsPage;

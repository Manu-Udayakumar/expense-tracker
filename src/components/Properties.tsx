import React, { useState, useEffect } from "react";
import {
  Building2,
  Bed,
  DollarSign,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Property {
  property_id: number;
  name: string;
  location: string;
  image_url: string[];
  description: string;
  rating: string;
  caretaker: string;
  bed_sheets: number;
  quilt_covers: number;
  pillow_covers: number;
  small_towels: number;
  big_towels: number;
  rooms?: number;
  status?: "Operational" | "Maintenance";
  occupancy?: number;
  revenue?: number;
  expenses?: number;
}

const Properties: React.FC = () => {
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");
  const [isLaundryModalOpen, setIsLaundryModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [laundryParams, setLaundryParams] = useState({
    bed_sheets: "",
    quilt_covers: "",
    pillow_covers: "",
    small_towels: "",
    big_towels: "",
  });
  const [checkInData, setCheckInData] = useState({
    guest_name: "",
    check_in_date: "",
    check_out_date: "",
    guest_id_file: null as File | null,
    signed_form_file: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = "http://localhost:5000";

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const response = await fetch(`${BASE_URL}/api/properties/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error("Token expired");
        throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error("Failed to fetch properties: Invalid response format");
      }

      const mappedProperties: Property[] = data.data.map((p: Property) => ({
        ...p,
        rooms: parseInt(p.description.match(/(\d+)\s*beds/)?.[1] || "0"),
        status: "Operational" as "Operational" | "Maintenance",
        rating:
          p.rating === "Not specified" || p.rating === "No reviews yet"
            ? undefined
            : parseFloat(p.rating),
      }));

      setProperties(mappedProperties);
    } catch (err) {
      console.error("Error fetching properties:", err);
      if (err instanceof Error && err.message === "Token expired") {
        console.log("Token expired or invalid, redirecting to login...");
        logout();
        navigate("/login", { state: { sessionExpired: true } });
      } else if (err instanceof Error) {
        setError(`Failed to load properties: ${err.message}`);
      } else {
        setError("Failed to load properties: Unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, logout]);

  const handleSetLaundryParams = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token || !selectedProperty) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/properties/${selectedProperty.property_id}/laundry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bed_sheets: parseInt(laundryParams.bed_sheets) || 0,
            quilt_covers: parseInt(laundryParams.quilt_covers) || 0,
            pillow_covers: parseInt(laundryParams.pillow_covers) || 0,
            small_towels: parseInt(laundryParams.small_towels) || 0,
            big_towels: parseInt(laundryParams.big_towels) || 0,
          }),
        }
      );
      if (!response.ok) {
        if (response.status === 403) throw new Error("Token expired");
        throw new Error("Failed to set laundry parameters");
      }
      await fetchProperties();
      setIsLaundryModalOpen(false);
      setLaundryParams({
        bed_sheets: "",
        quilt_covers: "",
        pillow_covers: "",
        small_towels: "",
        big_towels: "",
      });
      setError(null);
    } catch (err) {
      console.error("Error setting laundry params:", err);
      if (err instanceof Error && err.message === "Token expired") {
        console.log("Token expired or invalid, redirecting to login...");
        logout();
        navigate("/login", { state: { sessionExpired: true } });
      } else {
        setError("Failed to set laundry parameters.");
      }
    }
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token || !selectedProperty) return;

    const formData = new FormData();
    formData.append("guest_name", checkInData.guest_name);
    formData.append("check_in_date", checkInData.check_in_date);
    formData.append("check_out_date", checkInData.check_out_date || "");
    if (checkInData.guest_id_file)
      formData.append("guest_id_file", checkInData.guest_id_file);
    if (checkInData.signed_form_file)
      formData.append("signed_form_file", checkInData.signed_form_file);

    try {
      const response = await fetch(
        `${BASE_URL}/api/properties/${selectedProperty.property_id}/check-in`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!response.ok) {
        if (response.status === 403) throw new Error("Token expired");
        throw new Error("Failed to submit check-in");
      }
      setIsCheckInModalOpen(false);
      setCheckInData({
        guest_name: "",
        check_in_date: "",
        check_out_date: "",
        guest_id_file: null,
        signed_form_file: null,
      });
      setError(null);
    } catch (err) {
      console.error("Error submitting check-in:", err);
      if (err instanceof Error && err.message === "Token expired") {
        console.log("Token expired or invalid, redirecting to login...");
        logout();
        navigate("/login", { state: { sessionExpired: true } });
      } else {
        setError("Failed to submit check-in.");
      }
    }
  };

  const openLaundryModal = (property: Property) => {
    setSelectedProperty(property);
    setLaundryParams({
      bed_sheets: property.bed_sheets?.toString() || "",
      quilt_covers: property.quilt_covers?.toString() || "",
      pillow_covers: property.pillow_covers?.toString() || "",
      small_towels: property.small_towels?.toString() || "",
      big_towels: property.big_towels?.toString() || "",
    });
    setIsLaundryModalOpen(true);
  };

  const openCheckInModal = (property: Property) => {
    setSelectedProperty(property);
    setIsCheckInModalOpen(true);
  };

  const openCarousel = (property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setIsCarouselOpen(true);
  };

  const closeCarousel = () => {
    setIsCarouselOpen(false);
    setSelectedProperty(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) =>
        Math.min(prev + 1, selectedProperty.image_url.length - 1)
      );
    }
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  const totalPropertiesCount = properties.length;
  const totalRooms = properties.reduce(
    (acc, curr) => acc + (curr.rooms || 0),
    0
  );
  const avgOccupancy = "N/A";
  const avgRating =
    properties
      .filter((p) => p.rating !== undefined)
      .reduce(
        (acc, curr) =>
          acc + (typeof curr.rating === "number" ? curr.rating : 0),
        0
      ) / properties.filter((p) => p.rating !== undefined).length || 0;
  const totalRevenue = "N/A";

  const propertyVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    enter: { opacity: 0, x: 100 },
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t("properties")}</h2>
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setSelectedView("grid")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "grid" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            {t("gridView")}
          </button>
          <button
            onClick={() => setSelectedView("list")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "list" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            {t("listView")}
          </button>
        </div>
      </div>

      {isLoading && <p className="text-gray-500">Loading properties...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">{t("totalProperties")}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{totalPropertiesCount}</h3>
          <p className="text-sm text-gray-600 mt-2">{totalRooms} {t("totalRooms")}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Bed className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">{t("avgOccupancy")}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{avgOccupancy}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">{t("avgRating")}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{avgRating ? avgRating.toFixed(2) : "N/A"}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">{t("totalRevenue")}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{totalRevenue}</h3>
        </div>
      </div>

      {selectedView === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <motion.div
              key={property.property_id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.3 }}
              variants={propertyVariants}
            >
              <div className="relative">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="col-span-1">
                    <img
                      src={property.image_url[0] || "https://via.placeholder.com/150"}
                      alt={`${property.name} 1`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="col-span-1 grid grid-rows-2 gap-2">
                    <img
                      src={property.image_url[1] || "https://via.placeholder.com/150"}
                      alt={`${property.name} 2`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <img
                      src={property.image_url[2] || "https://via.placeholder.com/150"}
                      alt={`${property.name} 3`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={() => openCarousel(property)}
                  className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="text-sm font-medium">Show all photos</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{property.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      property.status === "Operational" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{property.description}</p>
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-gray-800 font-medium">{property.rating || "N/A"}</span>
                  <button
                    onClick={() => alert("Show reviews functionality to be implemented")}
                    className="ml-2 text-blue-600 hover:underline text-sm"
                  >
                    Show more
                  </button>
                </div>
                <p className="text-gray-600 mb-2">Caretaker: {property.caretaker || "None"}</p>
                <p className="text-gray-600 mb-4">
                  <a href={property.location} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {t("viewOnMap")}
                  </a>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openLaundryModal(property)}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all duration-300"
                  >
                    {t("laundrySettings")}
                  </button>
                  <button
                    onClick={() => openCheckInModal(property)}
                    className="px-4 py-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-all duration-300"
                  >
                    {t("checkIn")}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {properties.map((property) => (
            <motion.div
              key={property.property_id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col"
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.3 }}
              variants={propertyVariants}
            >
              <div className="relative">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="col-span-1">
                    <img
                      src={property.image_url[0] || "https://via.placeholder.com/150"}
                      alt={`${property.name} 1`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="col-span-1 grid grid-rows-2 gap-2">
                    <img
                      src={property.image_url[1] || "https://via.placeholder.com/150"}
                      alt={`${property.name} 2`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <img
                      src={property.image_url[2] || "https://via.placeholder.com/150"}
                      alt={`${property.name} 3`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={() => openCarousel(property)}
                  className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="text-sm font-medium">Show all photos</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{property.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      property.status === "Operational" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{property.description}</p>
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-gray-800 font-medium">{property.rating || "N/A"}</span>
                  <button
                    onClick={() => alert("Show reviews functionality to be implemented")}
                    className="ml-2 text-blue-600 hover:underline text-sm"
                  >
                    Show more
                  </button>
                </div>
                <p className="text-gray-600 mb-2">Caretaker: {property.caretaker || "None"}</p>
                <p className="text-gray-600 mb-4">
                  <a href={property.location} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {t("viewOnMap")}
                  </a>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openLaundryModal(property)}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all duration-300"
                  >
                    {t("laundrySettings")}
                  </button>
                  <button
                    onClick={() => openCheckInModal(property)}
                    className="px-4 py-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-all duration-300"
                  >
                    {t("checkIn")}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isCarouselOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-0 m-0">
          <div className="relative w-full h-full flex items-center justify-center p-0 m-0">
            <button
              onClick={closeCarousel}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-all duration-300 z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full z-50">
              {currentImageIndex + 1}/{selectedProperty.image_url.length}
            </div>
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center p-0 m-0">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={selectedProperty.image_url[currentImageIndex] || "https://via.placeholder.com/150"}
                  alt={`${selectedProperty.name} ${currentImageIndex + 1}`}
                  className="w-auto max-w-full h-auto max-h-[80%] object-contain rounded-lg"
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                />
              </AnimatePresence>
              <button
                onClick={prevImage}
                className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white shadow-lg p-2 rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-300 z-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white shadow-lg p-2 rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-300 z-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentImageIndex === selectedProperty.image_url.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isLaundryModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {t("laundrySettingsFor")} {selectedProperty.name}
              </h3>
              <motion.button
                onClick={() => setIsLaundryModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>
            <form onSubmit={handleSetLaundryParams} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("bedSheets")}</label>
                <motion.input
                  type="number"
                  min="0"
                  value={laundryParams.bed_sheets}
                  onChange={(e) => setLaundryParams({ ...laundryParams, bed_sheets: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder={t("enterBedSheets")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("quiltCovers")}</label>
                <motion.input
                  type="number"
                  min="0"
                  value={laundryParams.quilt_covers}
                  onChange={(e) => setLaundryParams({ ...laundryParams, quilt_covers: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder={t("enterQuiltCovers")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pillowCovers")}</label>
                <motion.input
                  type="number"
                  min="0"
                  value={laundryParams.pillow_covers}
                  onChange={(e) => setLaundryParams({ ...laundryParams, pillow_covers: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder={t("enterPillowCovers")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("smallTowels")}</label>
                <motion.input
                  type="number"
                  min="0"
                  value={laundryParams.small_towels}
                  onChange={(e) => setLaundryParams({ ...laundryParams, small_towels: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder={t("enterSmallTowels")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("bigTowels")}</label>
                <motion.input
                  type="number"
                  min="0"
                  value={laundryParams.big_towels}
                  onChange={(e) => setLaundryParams({ ...laundryParams, big_towels: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder={t("enterBigTowels")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  type="button"
                  onClick={() => setIsLaundryModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("cancel")}
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={
                    !laundryParams.bed_sheets &&
                    !laundryParams.quilt_covers &&
                    !laundryParams.pillow_covers &&
                    !laundryParams.small_towels &&
                    !laundryParams.big_towels
                  }
                >
                  {t("save")}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isCheckInModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {t("checkInFor")} {selectedProperty.name}
              </h3>
              <motion.button
                onClick={() => setIsCheckInModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>
            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("guestName")}</label>
                <motion.input
                  type="text"
                  required
                  value={checkInData.guest_name}
                  onChange={(e) => setCheckInData({ ...checkInData, guest_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder={t("enterGuestName")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkInDate")}</label>
                <motion.input
                  type="date"
                  required
                  value={checkInData.check_in_date}
                  onChange={(e) => setCheckInData({ ...checkInData, check_in_date: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkOutDate")}</label>
                <motion.input
                  type="date"
                  value={checkInData.check_out_date}
                  onChange={(e) => setCheckInData({ ...checkInData, check_out_date: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("guestIdUpload")}</label>
                <motion.input
                  type="file"
                  name="guest_id_file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setCheckInData({ ...checkInData, guest_id_file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("signedFormUpload")}</label>
                <motion.input
                  type="file"
                  name="signed_form_file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setCheckInData({ ...checkInData, signed_form_file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  type="button"
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("cancel")}
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!checkInData.guest_name || !checkInData.check_in_date}
                >
                  {t("submit")}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Properties;
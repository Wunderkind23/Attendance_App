import React, { useState } from "react";
import axios from "axios";
import { getGeolocation } from "./utils/geolocation";

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClockIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Fetch geolocation
      const location = await getGeolocation();

      // Create the payload
      const payload = {
        qr_code_token: "exampleToken123", // Replace with actual data
        email: "user@example.com",       // Replace with actual data
        name: "John Doe",                // Replace with actual data
        device_id: "unique-device-id",   // Replace with actual device identifier
        latitude: location.latitude,
        longitude: location.longitude,
      };

      // Make API request
      const response = await axios.post("https://your-backend-api.com/clock-in", payload);

      // Handle success
      setSuccess("Clock-in successful!");
      console.log("Response:", response.data);
    } catch (err) {
      // Handle errors
      setError(err.message || "Clock-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={handleClockIn}
        className={`bg-blue-500 text-white px-6 py-3 rounded ${loading ? "opacity-50" : ""}`}
        disabled={loading}
      >
        {loading ? "Clocking In..." : "Clock In"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
};

export default Attendance;

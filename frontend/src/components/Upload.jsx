import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const Upload = ({ letter, slogan }) => {
  const { token, setUser } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a file");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`http://localhost:5000/api/upload/${letter}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUser((prev) => {
          const updatedUser = { ...prev, photos: data.photos };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          return updatedUser;
        });
        setFile(null);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-lg w-60 
                    hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      {/* <h3 className="text-2xl font-extrabold text-pink-600">{letter}</h3> */}
      <span className="text-sm text-gray-700 mt-1 italic">{slogan} Date</span>

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="alert alert-error mt-3 w-full shadow-md rounded-lg"
        >
          <span className="font-semibold">{error}</span>
          <button
            onClick={() => setError("")}
            className="btn btn-xs btn-ghost ml-auto"
          >
            ✕
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mt-3 w-full file-input file-input-bordered file-input-pink"
      />

      <button
        onClick={handleUpload}
        className="btn btn-error mt-3 w-full transform hover:scale-105 transition-all duration-200"
        disabled={loading}
      >
        {loading ? (
          <Loading />
        ) : (
          "Upload"
        )}
      </button>
    </div>
  );
};

export default Upload;

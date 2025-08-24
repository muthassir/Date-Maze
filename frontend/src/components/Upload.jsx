import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const CLOUD_NAME = "de13d1vnc"; // from Cloudinary dashboard
const UPLOAD_PRESET = "my_upload_preset"; // unsigned preset

const Upload = ({ letter, slogan }) => {
  const { token, setUser, API } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        throw new Error(cloudinaryData.error?.message || "Cloudinary upload failed");
      }

      const photoUrl = cloudinaryData.secure_url;

      // 2. Save Cloudinary URL in backend
      const res = await fetch(`${API}/api/upload/${letter}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url: photoUrl }),
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
        setError(data.message || "Failed to save image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-transparent rounded-2xl shadow-lg w-60 
                    hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      <span className="text-sm text-error mt-1 italic">{slogan} Date</span>

      {error && (
        <div role="alert" className="alert alert-error mt-3 w-full shadow-md rounded-lg">
          <span className="font-semibold">{error}</span>
          <button onClick={() => setError("")} className="btn btn-xs btn-ghost ml-auto">✕</button>
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
        {loading ? <Loading /> : "Upload"}
      </button>
    </div>
  );
};

export default Upload;

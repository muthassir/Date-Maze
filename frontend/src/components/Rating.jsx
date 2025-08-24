import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { CiHeart } from "react-icons/ci";
import { IoIosHeart } from "react-icons/io";


const Rating = () => {
  const { user, token, setUser, API } = useAuth();
  const [myRating, setMyRating] = useState(0);
  const [overall, setOverall] = useState({ avgRating: 0, count: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingRating, setLoadingRating] = useState(true);
  const [alert, setAlert] = useState("");

  // Fetch overall rating
  const fetchOverall = async () => {
    try {
      const res = await axios.get(`${API}/api/rating`);
      setOverall(res.data);
    } catch (err) {
      console.error(err);
      setAlert("Can't get overall rating");
    }
  };

  // Fetch my rating from backend
  const fetchMyRating = async () => {
    try {
      if (!user?._id) return;
      const res = await axios.get(`${API}/api/rating/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyRating(res.data.rating || 0);

      // Update user in context only
      setUser((prev) => ({ ...prev, rating: res.data.rating || 0 }));
    } catch (err) {
      console.error(err);
      setAlert("Can't get your rating");
    } finally {
      setLoadingRating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchOverall();
      if (user?._id) {
        fetchMyRating();
      } else {
        setMyRating(0);
        setLoadingRating(false);
      }
    };
    fetchData();
  }, [user]);

  // Submit rating
  const handleRating = async (value) => {
    if (!user) return;
    setLoading(true);
    setAlert("");
    try {
      const res = await axios.post(
        `${API}/api/rating`,
        { rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyRating(res.data.rating || 0);
      setAlert("Rating saved successfully!");
      fetchOverall();

      // Update user in context only
      setUser((prev) => ({ ...prev, rating: res.data.rating || 0 }));
    } catch (err) {
      console.error(err);
      setAlert("Error saving rating");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 flex flex-col gap-4 items-center">
        <p>Please log in to rate your experience.</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-4 items-center">
      <h2 className="text-xl font-semibold">Rate Your Experience</h2>

      {/* Stars */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className="text-2xl text-error cursor-pointer"
            disabled={loading}
          >
            {star <= myRating ? <IoIosHeart /> : <CiHeart />}
          </button>
        ))}
      </div>

      {/* My rating */}
      <p>
        Your Rating:{" "}
        {loadingRating ? "Loading..." : myRating ? myRating : "Not rated yet"}
      </p>

      {/* Overall */}
      <p>
        Overall Rating:{" "}
        {overall.avgRating ? overall.avgRating.toFixed(1) : "0.0"} ⭐ (
        {overall.count} users)
      </p>

      {/* Alerts */}
      {loading && <p className="text-error">Saving...</p>}
      {alert && <p className="bg-error alert">{alert}</p>}
    </div>
  );
};

export default Rating;

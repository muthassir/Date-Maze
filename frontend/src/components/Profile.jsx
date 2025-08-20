import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";
import axios from "axios";

const Profile = () => {
  const { user, token, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(user?.status || "Single");
  const [coupleName, setCoupleName] = useState(user?.coupleName || "");
  const [partnerEmail, setPartnerEmail] = useState(user?.partnerEmail || "");
  const [isDirty, setIsDirty] = useState(false);

  // Check if user made changes
  useEffect(() => {
    if (
      status !== (user?.status || "Single") ||
      coupleName !== (user?.coupleName || "") ||
      partnerEmail !== (user?.partnerEmail || "")
    ) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [status, coupleName, partnerEmail, user]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.resolve(logout());
    } catch (err) {
      console.error(err);
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const res = await axios.put(
        "http://localhost:5000/api/auth/update",
        { status, coupleName, partnerEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(prev => {
        const updated = {
          ...prev,
          status: res.data.status,
          coupleName: res.data.coupleName,
          partnerEmail: res.data.partnerEmail
        };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });

      setError("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="navbar-end">
      <div className="btn btn-ghost btn-circle cursor-pointer">
        <div className="avatar">
          <div className="ring-error h-6 ring-offset-base-100 w-6 rounded-full ring-2 ring-offset-2 cursor-pointer">
            <button
              onClick={() =>
                document.getElementById("profile_modal").showModal()
              }
              className="cursor-pointer"
            >
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </button>

            <dialog id="profile_modal" className="modal modal-center sm:modal-middle">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Profile</h3>

                <div className="mt-2 space-y-2">
                  <p><strong>Name:</strong> {user?.username || "N/A"}</p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {user?.email ? (
                      <span>
                        {user.email}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </p>

                  {/* Status selector */}
                  <div>
                    <label className="font-semibold">Status:</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="select select-bordered select-sm w-full max-w-xs"
                    >
                      <option>Single</option>
                      <option>Dating</option>
                      <option>Married</option>
                    </select>
                  </div>

                  {/* Couple name input */}
                  {status !== "Single" && (
                    <div>
                      <label className="font-semibold">Couple Name:</label>
                      <input
                        type="text"
                        value={coupleName}
                        onChange={(e) => setCoupleName(e.target.value)}
                        className="input input-bordered input-sm w-full max-w-xs"
                        placeholder="Enter couple name"
                      />
                    </div>
                  )}

                  {/* Partner email input */}
                  {status !== "Single" && (
                    <div>
                      <label className="font-semibold">Partner Email:</label>
                      <input
                        type="email"
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        className="input input-bordered input-sm w-full max-w-xs"
                        placeholder="Enter partner's email"
                      />
                    </div>
                  )}
                </div>

                {error && (
                  <div role="alert" className="alert alert-error my-2">
                    <span>{error}</span>
                    <button
                      onClick={() => setError("")}
                      className="btn btn-xs btn-ghost ml-auto"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {isDirty && (
                  <button
                    className="btn btn-success mt-4 w-full"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? <Loading /> : "Save Changes"}
                  </button>
                )}

                <button
                  className="btn btn-error mt-2 w-full"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? <Loading /> : "Logout"}
                </button>

                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn btn-neutral">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

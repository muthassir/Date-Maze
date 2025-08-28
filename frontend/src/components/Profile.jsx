import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";
import axios from "axios";

const Profile = () => {
  const { user, token, setUser, logout, API } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(user?.status || "Single");
  const [partnerEmail, setPartnerEmail] = useState(user?.partnerEmail || "");
  const [coupleName, setCoupleName] = useState(user?.coupleName || "");
  const [isDirty, setIsDirty] = useState(false);

  // Track changes to enable Save button
  useEffect(() => {
    if (
      status !== (user?.status || "Single") ||
      partnerEmail !== (user?.partnerEmail || "") ||
      coupleName !== (user?.coupleName || "")
    ) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [status, partnerEmail, coupleName, user]);

  // Fetch partner username as coupleName when email changes
  useEffect(() => {
    const fetchPartnerName = async () => {
      if (!partnerEmail) return setCoupleName("");
      try {
        const res = await axios.get(`${API}/api/auth/by-email/${partnerEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupleName(res.data.username || "");
      } catch (err) {
        setCoupleName("");
      }
    };

    if (status !== "Single") {
      fetchPartnerName();
    } else {
      setCoupleName("");
    }
  }, [partnerEmail, status, API, token]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Logout failed. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      let res;
      if (status !== "Single" && partnerEmail) {
        // Call couple/link endpoint
        res = await axios.post(
          `${API}/api/couple/link`,
          { partnerEmail },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Update status only
        res = await axios.put(
          `${API}/api/auth/update`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Update context and localStorage
      setUser((prev) => {
        const updated = {
          ...prev,
          status: res.data.status || status,
          partnerEmail: res.data.partnerEmail || partnerEmail,
          coupleName: res.data.coupleName || coupleName,
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

  if (!user) return null;

  return (
    <div className="navbar-end">
      <div className="btn btn-ghost btn-circle cursor-pointer">
        <div className="avatar">
          <div className="ring-error h-6 ring-offset-base-100 w-6 rounded-full ring-2 ring-offset-2 cursor-pointer">
            <button
              onClick={() =>
                document.getElementById("profile_modal")?.showModal()
              }
              className="cursor-pointer"
            >
              {user.username?.charAt(0).toUpperCase()}
            </button>

            <dialog
              id="profile_modal"
              className="modal modal-center sm:modal-middle"
            >
              <div className="modal-box">
                <h3 className="font-bold text-lg">Profile</h3>

                <div className="mt-2 space-y-2">
                  <p>
                    <strong>Name:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Couple Name:</strong> {user.coupleName? user.coupleName :"not linked"}
                  </p>
            
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
                      {coupleName && (
                        <p className="mt-1 text-sm">
                          <strong>Couple Name:</strong> {coupleName}
                        </p>
                      )}
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
                >
                  Logout
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

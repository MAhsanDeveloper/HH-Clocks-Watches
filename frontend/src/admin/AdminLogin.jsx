/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const AdminLogin = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/auth/login`,
        { mobileNumber, password },
        { withCredentials: true }
      );

  navigate("/admin");
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-sm w-full bg-amber-700 rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Admin Login
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mobile Number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />

        <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full text-white py-2 rounded-lg font-semibold transition duration-200 ${
              loading
                ? "bg-amber-500 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700 cursor-pointer"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FiLoader className="animate-spin w-5 h-5" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

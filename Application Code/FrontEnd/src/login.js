import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid login credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2E3C44] text-[#E2F1E7]">
      <div className="bg-[#2E3C44] p-8 rounded-lg shadow-lg w-96 border border-[#487B77]">
        <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#366D73] text-white border border-[#487B77] focus:ring-2 focus:ring-[#5CA5A5] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#366D73] text-white border border-[#487B77] focus:ring-2 focus:ring-[#5CA5A5] focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-[#5CA5A5] hover:bg-[#487B77] py-2 px-4 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-[#A2B3AF]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#89C2D9] hover:underline transition duration-300"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

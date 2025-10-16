// src/pages/AdminPanel.js
import React, { useEffect, useState } from "react";
import { auth } from "./firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === "admin@test.com") {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (uid) => {
    try {
      await fetch(`http://localhost:3001/users/${uid}`, { method: "DELETE" });
      setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2E3C44] text-white">
        <h2 className="text-xl">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2E3C44] text-[#E2F1E7]">
      {/* Navbar */}
      <nav className="bg-[#366D73] p-4 flex justify-between items-center">
        <Link to="/home" className="text-white text-xl font-semibold">
          Admin Panel
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/home" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <button
            onClick={() => auth.signOut().then(() => navigate("/login"))}
            className="text-white font-semibold hover:text-[#5CA5A5] transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 flex flex-col items-center">
        <div className="bg-[#2E3C44] w-full max-w-4xl p-8 rounded-lg shadow-lg border border-[#487B77]">
          <h2 className="text-2xl font-semibold mb-6 text-center">Users</h2>
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.uid}
                className="bg-[#366D73] p-4 rounded-lg flex justify-between items-center"
              >
                <span>{user.email}</span>
                <button
                  onClick={() => handleDeleteUser(user.uid)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

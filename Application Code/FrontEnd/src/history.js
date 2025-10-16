import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate, Link } from "react-router-dom";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "history"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map((doc) => doc.data());
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#2E3C44] text-[#E2F1E7]">
      <nav className="bg-[#366D73] p-4 flex justify-between items-center">
        <Link to="/home" className="text-white text-xl font-semibold">
          Nitrogen Level Predictor
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/home" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white font-semibold"
            >
              {user ? user.email : "User"} ▼
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="p-8 flex flex-col items-center">
        <div className="bg-[#2E3C44] w-full max-w-2xl p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Prediction History
          </h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-t-transparent border-[#5CA5A5] rounded-full animate-spin"></div>
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-gray-400">Your history is empty.</p>
          ) : (
            <ul className="space-y-6">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="bg-[#366D73] p-6 rounded-lg flex items-center space-x-6"
                >
                  {/* Larger Image */}
                  <img
                    src={item.imageUrl}
                    alt="Uploaded"
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{item.result}</p>
                    <p className="text-gray-300">{item.remarks}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(item.date.toDate()).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
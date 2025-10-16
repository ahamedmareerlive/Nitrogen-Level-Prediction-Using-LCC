// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Home() {
  const [result, setResult] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
      if (currentUser.email === "admin@test.com") {
        setIsAdmin(true);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const uploadImageToFirebase = async (file) => {
    const imageRef = ref(storage, `images/${user.uid}/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    return url;
  };

  const handlePrediction = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImageToFirebase(image);

      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch(
        "https://0bcd-34-75-115-93.ngrok-free.app/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const prediction = data.predicted_nitrogen_level;

      setResult(prediction);

      await addDoc(collection(db, "history"), {
        userId: auth.currentUser.uid,
        result: prediction,
        remarks,
        imageUrl,
        date: new Date(),
      });

      setRemarks("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("There was an error with the prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <Link to="/history" className="text-gray-300 hover:text-white">
            History
          </Link>

          {isAdmin && (
            <Link to="/admin" className="text-gray-300 hover:text-white">
              Admin Panel
            </Link>
          )}

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
        <h2 className="text-2xl font-semibold mb-4">Upload and Predict</h2>
        <form onSubmit={handlePrediction} className="w-full max-w-lg space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full border rounded-lg px-3 py-2 bg-[#2E3C44] text-white"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-full h-64 object-cover rounded-lg mt-4"
            />
          )}
          <textarea
            placeholder="Enter your remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="block w-full px-3 py-2 border rounded-lg bg-[#2E3C44] text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#5CA5A5] hover:bg-[#487B77] text-white py-2 px-4 rounded-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>
        {result && (
          <h3 className="mt-6 text-lg font-semibold">
            Predicted Nitrogen Level: {result}
          </h3>
        )}
      </div>
    </div>
  );
}

export default Home;
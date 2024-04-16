// ProfilePage.js
import "../css/Profile.css";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Warning from "../component/Warning";
import { useAuthToken } from "../AuthTokenContext";
import Loader from "../component/Loader";

const ProfilePage = () => {
  const [id, setId] = useState(null);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [mobile_number, setMoblieNumber] = useState("");
  const { isAuthenticated, user } = useAuth0();
  const { accessToken } = useAuthToken();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      getProfileDetails();
    }
  }, [accessToken]);

  const getProfileDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json());

      setLoading(false);
      console.log(response);
      if (response.data) {
        const { email, image, gender, id, age, mobile_number } = response.data;
        setId(id);
        setEmail(email);
        setAge(age ? age : "");
        setGender(gender ? gender : "");
        setImage(image ? image : "");
        setMoblieNumber(mobile_number ? mobile_number : "");
      }
    } catch (e) {
      alert("Failed to get Profile Details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here
    if (gender == "" || age === "" || mobile_number == "") {
      alert("All fields are required");
      return;
    }
    const data = {
      age: parseInt(age),
      gender: gender,
      email: email,
      mobile_number: mobile_number.toString(),
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}profile/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      ).then((res) => res.json());

      setLoading(false);
      if (response.data) {
        alert(response.msg);
      } else {
        alert("Failed to update profile");
      }
    } catch (e) {
      alert("Failed to update details");
    }
  };

  if (!isAuthenticated) {
    return <Warning />;
  }
  if (loading) return <Loader />;
  return (
    <div className="profile-container">
      <div className="profile-pic">
        {image && <img src={image} alt="Profile" className="profile-image" />}
      </div>
      <div className="profile-details">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="profile-input"
              value={email}
              placeholder="Email"
              disabled={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              className="profile-input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Moblie Number:</label>
            <input
              type="number"
              id="number"
              className="profile-input"
              value={mobile_number}
              onChange={(e) => setMoblieNumber(e.target.value)}
              placeholder="Moblie Number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              className="profile-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <p>🔑 Auth0Id: {user.sub}</p>
          </div>
          <div>
            <p>✅ Email verified: {user.email_verified?.toString()}</p>
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

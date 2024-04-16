import "./App.css";
// import "./css/Header.css";
// import "./css/CruiseCard.css";
// import "./css/CruiseDetails.css";
// import "./css/BookingDetails.css";
// import "./css/Profile.css";
// import "./css/ScrollView.css";
// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Home from "./pages/Homepage";
import Login from "./Login";
import Register from "./Register";
import Layout from "./Layout";
import CruiseDetails from "./component/CruiseDetails";
import ProfilePage from "./pages/Profile";
import { AuthTokenProvider } from "./AuthTokenContext";
import BookingDetails from "./pages/BookingDetails";
import VerifyUser from "./component/VerifyUser";
import ContactUs from "./pages/ContactUs";


const App = () => {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      }}
    >
      <AuthTokenProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/details/:id" element={<CruiseDetails />} />
              <Route path="/booking-details" element={<BookingDetails />} />
              <Route path="/verify-user" element={<VerifyUser />} />
              <Route path="/contact-us" element={<ContactUs />} />
            </Route>
          </Routes>
        </Router>
      </AuthTokenProvider>
    </Auth0Provider>
  );
};

export default App;

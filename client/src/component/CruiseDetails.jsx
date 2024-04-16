// CruiseDetails.js
import '../css/CruiseDetails.css'
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import Loader from "./Loader";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { CuriseStatus } from "../utils/constant";

const CruiseDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [curiseDetails, setDetails] = useState(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { accessToken } = useAuthToken();
  useEffect(() => {
    const getCuriseDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}cruise/${id}`,
          {
            method: "GET",
          }
        ).then((res) => res.json());

        setLoading(false);
        if (response) {
          setDetails(response.data);
        }
      } catch (e) {
        alert("Failed to fetch cruise details");
      }
    };

    if (id) {
      getCuriseDetails();

      return () => {
        // Cleanup function to cancel any ongoing fetch request
        setDetails(null); // Clear curiseDetails to avoid potential memory leaks
      };
    }
  }, [id, accessToken]); // Include all dependencies in the dependency array

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    const requestData = {
      cruise_id: id,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}cruise/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestData),
        }
      ).then((res) => res.json());

      if (response.error) {
        alert(response.error);
      } else {
        alert(response.msg);
        window.location.href = '/booking-details';
      }
    } catch (error) {
      alert("Failed to book the cruise");
    }
  };

  if (loading) return <Loader />;
  if (!curiseDetails) return null;
  return (
    <div className="cruise-details">
      <div className="image-container">
        <img src={`/images/${curiseDetails.image}`} alt="Cruise" className="cruise-image" />
      </div>
      <table className="details-table">
        <tbody>
          <tr>
            <td className="label">Cruise Name:</td>
            <td className="value">{curiseDetails.name}</td>
          </tr>
          <tr>
            <td className="label">Description:</td>
            <td className="value">{curiseDetails.description}</td>
          </tr>
          <tr>
            <td className="label">Start Date:</td>
            <td className="value">
              {curiseDetails.start_date.substring(0, 10)}
            </td>
          </tr>
          <tr>
            <td className="label">End Date:</td>
            <td className="value">{curiseDetails.end_date.substring(0, 10)}</td>
          </tr>
        </tbody>
      </table>
      {curiseDetails.status !== CuriseStatus.upComing && (
        <button className="booking-button" onClick={() => handleBookNow()}>
          Book Now
        </button>
      )}
    </div>
  );
};

export default CruiseDetails;

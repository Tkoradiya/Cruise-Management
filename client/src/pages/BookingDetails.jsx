import '../css/BookingDetails.css'
// BookingDetails.js
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Warning from "../component/Warning";
import { useAuthToken } from "../AuthTokenContext";
import Loader from "../component/Loader";
import { formatDate } from "../utils/constant";
import DeleteIcon from "../assets/deleteIcon.svg";
import EditIcon from "../assets/editIcon.svg";

const BookingDetails = () => {
  const { isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState([]);
  const { accessToken } = useAuthToken();

const [uploading, setUploading] = useState(false);
const [editedRows, setEditedRows] = useState([]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      getBookDetails();
    }
  }, [accessToken]);

  const getBookDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}mybooking`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ).then((res) => res.json());

      setLoading(false);
      if (response) {
        setBookingDetails(response.data);
      }
    } catch (e) {
      alert("Failed to fetch booking list");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}mybooking/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ).then((res) => res.json());

      setLoading(false);
      if (response) {
        getBookDetails(response.data);
      }
    } catch (e) {
      console.log(e);
      alert("Failed to delete booking");
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      handleDelete(id);
    }
  };

  const handleEdit = (id) => {
    if (!editedRows.includes(id)) {
      setEditedRows([...editedRows, id]);
    }
  };

  const handleFileChange = async (e, id) => {
    const file = e.target.files[0];

    if (!file) return; // Do nothing if no file selected

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", id);

    try {
      setUploading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      alert("Image succesffully changed!");
      window.location.href = '/booking-details';
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  
  if (!isAuthenticated) {
    return <Warning />;
  }
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="booking-details">
      <h2>My Booking Details</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th className="booking-header">Cruise Name</th>
            <th className="booking-header">Start Date</th>
            <th className="booking-header">End Date</th>
            <th className="booking-header">Status</th>
            <th className='booking-header'>Image</th>
            <th className='booking-header'>Edit Image</th>
            <th className="booking-header" style={{ textAlign: "center" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {bookingDetails.map((item, index) => (
            <tr key={index}>
              <td className="booking-cell">{item.cruise.name}</td>
              <td className="booking-cell">
                {formatDate(item.cruise.start_date)}
              </td>
              <td className="booking-cell">
                {formatDate(item.cruise.end_date)}
              </td>
              <td className="booking-cell">Confirmed</td>
              
              <td className="booking-cell">
                {editedRows.includes(item.id) ? (
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, item.cruise.id)}
                  />
                ) : (
                  <img src={`/images/${item.cruise.image}`} alt="Cruise Image" width={20} />
                )}
              </td>
              <td className="booking-cell" style={{ textAlign: "center" }}>
                {editedRows.includes(item.id) ? (
                  <button onClick={() => setEditedRows(editedRows.filter((rowId) => rowId !== item.id))}>
                    Cancel
                  </button>
                ) : (
                  <img
                    src={EditIcon}
                    onClick={() => handleEdit(item.id)}
                    style={{ height: "20px", cursor: "pointer" }}
                    alt="Edit Icon"
                  />
                )}
</td>

              <td className="booking-cell" style={{ textAlign: "center" }}>
                <img
                  src={DeleteIcon}
                  onClick={() => confirmDelete(item.id)}
                  style={{ height: "20px", cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}

          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default BookingDetails;

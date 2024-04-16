import React, { useEffect, useState } from "react";
import "../css/ContactUs.css";
import { useAuthToken } from "../AuthTokenContext";
import Warning from "../component/Warning";
import { useAuth0 } from "@auth0/auth0-react";
const ContactUs = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { isAuthenticated, user } = useAuth0();
  const { accessToken } = useAuthToken();
  useEffect(() => {
    const fetchWeatherData = async () => {
      const options = {
        method: "GET",
       headers: {
          'X-RapidAPI-Key': 'e26ca4a144msh363fb4281e0da20p19f386jsnd61c4901dfb9',
          'X-RapidAPI-Host': 'easy-weather1.p.rapidapi.com'
        }
      };

      const params = new URLSearchParams({
        latitude: "37.615223",
        longitude: "-122.389977",
      });

      const url = `https://easy-weather1.p.rapidapi.com/daily/5?${params}`;

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (isAuthenticated) {
      fetchWeatherData();
    }
  }, []);

  const renderWeatherData = () => {
    if (!weatherData || !weatherData.forecastDaily || !weatherData.forecastDaily.days) {
      return <p>No weather data available</p>;
    }
  
    return (
      <div className="weather-data-container">
        {weatherData.forecastDaily.days.map((day, index) => (
          <div key={index} className="weather-day">
            <h3>
              {new Date(day.forecastStart).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </h3>
            <p>
              Temperature: {day.temperatureMax}°C - {day.temperatureMin}°C
            </p>
            <p>Condition: {day.conditionCode}</p>
          </div>
        ))}
      </div>
    );
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      alert("All fields are required");
      return;
    }
    try {
      const data = {
        message: message,
        subject: subject,
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}contactUs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      ).then((res) => res.json());

      if (response) {
        setSubject("");
        setMessage("");
        alert(response.msg);
      }
    } catch (e) {
      console.log(e);
      alert("Failed to delete booking");
    }
  };
  //console.log(isAuthenticated)
  if (!isAuthenticated) {
    return <Warning />;
  }
  return (
    <div className="contact-us-container">
      <div className="contact-form">
        <h2>Contact Us</h2>
        <form  onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Subject:</label>
            <input
              type="text"
              id="subject"
              className="contact-input"
              value={subject}
              placeholder="Enter your subject"
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              type="text"
              id="message"
              className="contact-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      <div className="weather-data">
        <h2>5-Day Weather Forecast</h2>
        {renderWeatherData()}
      </div>
    </div>
  );
};

export default ContactUs;

// Card.js
import "../css/CruiseCard.css";
import React from "react";

import { formatDate } from "../utils/constant";

const Card = ({ onClick, item }) => {

  return (
    <div className="card" onClick={onClick}>
      <img src={`/images/${item.image}`} alt="Cruise" className="card-image" />
      <div className="card-details">
        <h3 className="cruise-name">{item.name}</h3>
        <p className="destination">{item.description}</p>
        <p className="date">
          {formatDate(item.start_date)} - {formatDate(item.end_date)}
        </p>
      </div>
    </div>
  );
};

export default Card;

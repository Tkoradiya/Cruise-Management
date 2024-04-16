import React from "react";
import Card from "./CruiseCard";
import { useNavigate } from "react-router-dom";
import "../css/ScrollView.css";
const VerticalScrollView = ({ id, data }) => {
  const navigate = useNavigate();
  const handleScroll = (scrollDirection) => {
    const scrollContainer = document.getElementById(id);
    if (scrollContainer) {
      if (scrollDirection === "left") {
        scrollContainer.scrollBy({
          left: -100,
          behavior: "smooth",
        });
      } else if (scrollDirection === "right") {
        scrollContainer.scrollBy({
          left: 100,
          behavior: "smooth",
        });
      }
    }
  };
  const handleCruiseCardClick = (details) => {
    navigate(`/details/${details}`);
  };
  return (
    <div className="scroll-container">
      <div className="scroll-view" id={id}>
        {/* Horizontal scroll view content */}
        <div className="scroll-content">
          {data.map((item, index) => (
            <Card key={index} item={item} onClick={() => handleCruiseCardClick(item.id)} />
          ))}
        </div>
      </div>
      <div
        className="scroll-indicator left"
        onClick={() => handleScroll("left")}
      >
        ◄
      </div>
      <div
        className="scroll-indicator right"
        onClick={() => handleScroll("right")}
      >
        ►
      </div>
    </div>
  );
};

export default VerticalScrollView;

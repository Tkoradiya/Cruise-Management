// MainSection.js
import React, { useEffect, useState } from "react";
import VerticalScrollView from "./ScrollView";
import Loader from "./Loader";

const MainSection = () => {
  const [loading, setLoading] = useState(true);
  const [curiseList, setCruiseList] = useState([]);
  useEffect(() => {
    getCuriseList();
  }, []);

  const getCuriseList = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}cruise`, {
        method: "GET",
      }).then((res) => res.json());

      setLoading(false);
      if (response) {
        setCruiseList(response.data);
      }
    } catch (e) {
      console.log(e)
      alert("Failed to fetch cruise list");
    }
  };

  if (loading) return <Loader />;

  if (curiseList.length > 1) {
    return (
      <>
        <h2 className="cardTitle">Newly Added</h2>
        <VerticalScrollView
          id="scroll-container-new"
          data={curiseList.filter((item) => item.status === "Newly_added")}
        />
        <h2 className="cardTitle">Available</h2>
        <VerticalScrollView
          id="scroll-container-avilable"
          data={curiseList.filter((item) => item.status === "Available")}
        />
        <h2 className="cardTitle">Upcoming</h2>
        <VerticalScrollView
          id="upcoming"
          data={curiseList.filter((item) => item.status === "Upcoming")}
        />
      </>
    );
  }
  return null;
};

export default MainSection;

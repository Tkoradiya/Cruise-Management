// Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./component/Header";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "./component/Loader";

const Layout = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div>
        <Header />
        <Outlet /> {/* Renders the child routes */}
      </div>
    );
  }
};

export default Layout;

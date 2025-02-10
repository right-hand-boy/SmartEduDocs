import React from "react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to={"/"}>
      <img src="/logo.png" alt="logo for SmartEduDocs" className="h-10" />
    </Link>
  );
}

export default Logo;

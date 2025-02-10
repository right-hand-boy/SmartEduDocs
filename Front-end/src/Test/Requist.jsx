import React, { useEffect } from "react";

function Requist() {
  useEffect(() => {
    const response = fetch("http://127.0.0.1:8080/api/faculties", {
      method: "Get",
    }).then((res) => res.json());
  }, []);
  return <div>Requist</div>;
}

export default Requist;

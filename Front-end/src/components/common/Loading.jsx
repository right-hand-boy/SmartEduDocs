// FullScreenLoadingComponent.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-transparent h-screen w-screen z-30">
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        className="h-12 w-12 text-brightGreen"
      />
    </div>
  );
}

export default Loading;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PageTitle({ title }) {
  const location = useLocation();

  useEffect(() => {
    // Define a mapping of titles to page titles

    // Set the document title based on the provided title prop
    document.title = title || "SmartEduDocs";
  }, [location, title]);

  return null;
}

export default PageTitle;

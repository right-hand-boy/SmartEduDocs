import React, { useEffect, useState } from "react";
import PageTitle from "../utils/PageTitle";
import {
  FaBookmark,
  FaDownload,
  FaExclamationTriangle,
  FaSave,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import { MdDescription } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function DocumentsDetail() {
  const { user } = useAuth();
  const { bookId } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const directDownloadLink = (link) => {
    return link ? link.replace("/upload/", "/upload/fl_attachment/") : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/documents/get/${bookId}`
        ).then((res) => res.json());
        if (response.ok || response.success) {
          setDocument(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookId]);
  const saveDocument = async () => {
    if (user == null) {
      toast.error("Please Login first");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("http://localhost:8080/api/save/document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add this header to indicate the request body is JSON
        },
        body: JSON.stringify({
          userId: user.id,
          documentId: bookId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // setDocument(result.data);
        toast.success("Document saved succesfully");
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = (url) => {
    if (!user) {
      toast.error("You must be logged in to download this document.");
      return;
    }

    // Redirect to the direct download link if user is authenticated
    window.open(directDownloadLink(url), "_blank");
  };

  if (loading) return <Loading />;
  return (
    <>
      <PageTitle title={document ? document.title : "Unknown Document"} />
      {document != null ? (
        <div>
          <div
            className="relative h-96 w-full flex items-center justify-end bg-cover bg-gray-100 bg-center"
            style={{
              backgroundImage: `url(${document.coverImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <img
              src={document.coverImageUrl}
              alt=""
              className="h-80 z-30 mr-24 object-scale-down object-center bg-gray-100"
            />

            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="absolute bottom-2 w-full items-end px-2  md:px-6 flex justify-between gap-6">
              <h1 className="text-white text-2xl md:text-4xl whitespace-nowrap max-w-min md:min-w-fit overflow-hidden font-extrabold">
                {document.title}
              </h1>
              <button
                onClick={saveDocument}
                className="h-14 text-3xl text-white translate-y-1/2 bg-brightGreen w-fit p-3 rounded-full"
              >
                {saving ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="h-8 w-8 text-white"
                  />
                ) : (
                  <FaBookmark title="Save" />
                )}
              </button>
            </div>
          </div>
          <div className="h-full p-4 pt-6">
            {/* <Link to={`/document/${document.id}`}>
              <img
                src={book.coverImageurl || "/pragmatic_programmer.jpg"}
                alt=""
                className="h-full w-72 md:w-56 object-cover"
              />
            </Link> */}
            <p className="font-bold">
              Description:{" "}
              <span className="text-gray-700 font-medium italic text-sm">
                {document.description}
              </span>
            </p>
            <div className="grid grid-col-1 md:grid-cols-2 mt-2 gap-2 px-4 py-2">
              <p className="font-bold capitalize">
                Department:{" "}
                <span className="text-gray-700 font-medium italic text-sm">
                  {document.departmentName}
                </span>
              </p>
              <p className="font-bold capitalize">
                Course{" "}
                <span className="text-gray-700 font-medium italic text-sm">
                  {document.courseName}
                </span>
              </p>
              <p className="font-bold capitalize">
                Last Modified date:{" "}
                <span className="text-gray-700 font-medium italic text-sm">
                  {document.lastModifiedDate}
                </span>
              </p>
              <p className="font-bold capitalize">
                published by:{" "}
                <span className="text-gray-700 font-medium italic text-sm">
                  {document.uploadedBy}
                </span>
              </p>
            </div>
            <div className="space-y-4">
              {/* View Document Section */}
              <div className="flex flex-wrap gap-4 p-4 shadow-md justify-between items-center bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <MdDescription className="text-9xl md:text-3xl text-brightGreen" />
                  <p className="max-w-4xl text-gray-700">
                    Access this document to view its full content online.
                    Perfect for quick reviews or reference without downloading.
                  </p>
                </div>
                <a
                  href={directDownloadLink(document.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-brightGreen text-white rounded-lg font-semibold capitalize hover:bg-green-600 transition"
                  aria-label="View Document"
                >
                  <MdDescription className="text-xl" />
                  View Document
                </a>
              </div>

              {/* Download Document Section */}
              <div className="flex items-center justify-center p-6 shadow-lg rounded-lg bg-gray-200">
                <div className="flex flex-col items-center justify-center text-center bg-opacity-60 bg-black p-8 rounded-lg space-y-6 w-full max-w-md">
                  <img
                    src="/download.webp"
                    className="h-24 w-24 object-cover rounded-full"
                    alt=""
                  />
                  <p className="text-white text-lg font-semibold mb-4">
                    Download this document for offline use. Ensure you have
                    access even without an internet connection.
                  </p>
                  <button
                    onClick={() => handleDownload(document.url)}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-brightGreen text-white rounded-full font-semibold hover:bg-green-600 transition transform hover:scale-105"
                    aria-label="Download Document"
                  >
                    <FaDownload className="text-xl" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <div>
            <FaExclamationTriangle className="text-red-800 w-10 h-10 mx-auto mb-4" />
            <div className="flex items-center space-x-3">
              <p className="text-lg font-semibold text-red-800">
                There are no document available.
              </p>
            </div>
            <p className="mt-2 text-gray-700">
              Please try the following suggestions:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-gray-700">
              <li>Check your internet connection.</li>
              <li>Ensure the server is running.</li>
              <li>Verify your query and try again.</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentsDetail;

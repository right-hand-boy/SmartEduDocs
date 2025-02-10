import React, { useEffect, useState } from "react";
import PageTitle from "../utils/PageTitle";
import { Link, useParams } from "react-router-dom";
import {
  FaBarcode,
  FaDownload,
  FaExclamationTriangle,
  FaFolderOpen,
  FaSave,
} from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import Loading from "../components/common/Loading";
import { toast } from "react-toastify";
import { useAuth } from "../context/Authcontext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
function DocumentsList() {
  const { user } = useAuth();
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const directDownloadLink = (link) => {
    return link.replace("/upload/", "/upload/fl_attachment/");
  };
  const saveDocument = async (docId) => {
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
          documentId: docId,
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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8080/api/course/${courseId}`,
          {
            method: "GET",
          }
        ).then((res) => res.json());

        if (response.success || response.ok) {
          // Set course data after fetching
          setCourse(response?.data || {});
          setDocuments(response?.data?.documents || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading when fetch is complete
      }
    };

    fetchData();
  }, [courseId]); // Re-fetch when courseId changes
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
      <PageTitle
        title={`${
          course.courseName ? course.courseName : "Unknown course"
        } Documnets Lists`}
      />
      {Object.keys(course).length > 0 ? (
        <div className="p-4 md:p-6">
          <div className="bg-white p-4 rounded-lg mb-6">
            <h1 className="capitalize text-2xl font-bold mb-3">
              {course.courseName}
            </h1>
            <p className="my-1 block text-gray-600 font-semibold justify-self-start">
              Department of {course.departmentName}
            </p>

            <p className="text-sm mb-3">{course.description}</p>
            <p className="font-semibold flex items-center mb-3">
              <FaBarcode className="mr-2 text-brightGreen" /> Course code:{" "}
              {course.courseCode}
            </p>
          </div>
          <div className="flex justify-between gap-3 mb-3 items-center">
            <h2 className="font-semibold text-xl">docs list</h2>
            <p className="capitalize flex items-center">
              <FaFolderOpen className="mr-2 text-brightGreen" />{" "}
              {course.docCount} documents
            </p>
          </div>
          {documents.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-wrap md:px-3 md:py-2">
              {documents.map((doc, index) => {
                return (
                  <li
                    key={index}
                    className="flex w-full overflow-hidden bg-white rounded-md relative"
                  >
                    <div
                      className="absolute top-2 right-2 text-xl text-brightGreen cursor-pointer"
                      onClick={() => {
                        setSavingId(doc.id);
                        saveDocument(doc.id);
                      }}
                    >
                      {saving && savingId === doc.id ? (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="h-6 w-6 text-brightGreen"
                        />
                      ) : (
                        <FaBookmark title="Save" />
                      )}
                    </div>

                    <Link to={`/document/${doc.id}`}>
                      <div className="self-stretch w-36 h-full overflow-hidden rounded-md rounded-r-none">
                        <img
                          src={doc.coverImageUrl || "/pragmatic_programmer.jpg"}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 bg-gray-100"
                        />
                      </div>
                    </Link>

                    <div className="flex flex-col gap-2 px-3 pb-1">
                      <Link
                        to={`document/${doc.id}`}
                        className="font-bold mr-4 md:text-lg capitalize"
                      >
                        {doc.title}
                      </Link>
                      <p className="text-sm">
                        {doc.description.slice(0, 70)}...
                      </p>
                      <p className="flex gap-2">
                        <span className="font-bold">Size:</span>{" "}
                        <span className="uppercase">{doc.size}</span>
                      </p>
                      <button
                        className="flex gap-2 items-center "
                        onClick={() => handleDownload(doc.url)}
                      >
                        <FaDownload className="text-green-500" />:{" "}
                        <span className="text-green-600">Download</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div>
                <FaExclamationTriangle className="text-red-800 w-10 h-10 mx-auto mb-4" />
                <div className="flex items-center space-x-3">
                  <p className="text-lg font-semibold text-red-800">
                    There are no document available.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <div>
            <FaExclamationTriangle className="text-red-800 w-10 h-10 mx-auto mb-4" />
            <div className="flex items-center space-x-3">
              <p className="text-lg font-semibold text-red-800">
                There are no courses available.
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

export default DocumentsList;

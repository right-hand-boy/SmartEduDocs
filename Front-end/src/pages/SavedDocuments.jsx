import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiDotsVertical } from "react-icons/hi";
import { FaDownload } from "react-icons/fa";
import PageTitle from "../utils/PageTitle";
import { useAuth } from "../context/Authcontext";
import { FaFolderClosed } from "react-icons/fa6";
import Loading from "../components/common/Loading";

const SavedDocuments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [toDeleteDocId, setToDeleteDocId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/saved-documents/${user.id}`
        );
        const data = await response.json();
        if (response.ok) {
          setSavedDocuments(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/saved-document/${toDeleteDocId}`,
        {
          method: "DELETE",
        }
      ).then((res) => res.json());

      if (response.success) {
        toast.success("Saved document deleted successfully");
        setSavedDocuments(
          savedDocuments.filter((doc) => doc.id !== toDeleteDocId)
        );
      } else {
        toast.error(response.message || "Error while deleting");
      }
    } catch (error) {
      toast.error("Error while deleting");
      console.error(error);
    } finally {
      setLoading(false);
      setShowConfirmation(false);
      setActiveMenu(null);
    }
  };

  const toggleMenu = (id) =>
    setActiveMenu((prevId) => (prevId === id ? null : id));

  const handleDownload = (url) => {
    if (!user) {
      toast.error("You must be logged in to download this document.");
      return;
    }
    window.open(url, "_blank");
  };
  console.log(savedDocuments);

  if (loading) return <Loading />;
  return (
    <>
      <PageTitle title="Saved Documents - SmartEduDocs" />
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Saved Documents
        </h1>
        {savedDocuments.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedDocuments.map((doc) => (
              <li
                key={doc.id}
                className="relative bg-white shadow rounded-lg border flex justify-between"
              >
                <Link
                  to={`/document/${doc.documentId}`}
                  className="flex gap-2 w-full"
                >
                  <img
                    src={doc.coverImageUrl || "/pragmatic_programmer.jpg"}
                    alt="Document Cover"
                    className="w-28 h-full object-cover rounded-md rounded-r-none"
                  />
                  <div className="p-2">
                    <h2 className="text-lg font-semibold text-gray-700">
                      {doc.title}
                    </h2>
                    <p className="font-bold text-gray-800">
                      By: {doc.uploadedBy}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-bold">Description:</span>{" "}
                      {doc.description.slice(0, 70)}...
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold">Size:</span>
                      <span className="uppercase">{doc.size}</span>
                    </p>
                    <button
                      className="flex gap-2 items-center text-green-600"
                      onClick={() => handleDownload(doc.url)}
                    >
                      <FaDownload className="text-green-500" /> Download
                    </button>
                  </div>
                </Link>
                <div className="relative">
                  <button
                    className="p-2 text-gray-500 hover:text-gray-800"
                    onClick={() => toggleMenu(doc.id)}
                  >
                    <HiDotsVertical className="w-6 h-6 text-brightGreen" />
                  </button>
                  {activeMenu === doc.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border shadow-lg rounded-lg">
                      <button
                        onClick={() => {
                          setToDeleteDocId(doc.id);
                          setShowConfirmation(true);
                          console.log("trying to delete here");
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <FaFolderClosed className="text-red-800 w-10 h-10 mx-auto mb-4" />
              <p className="text-lg font-semibold text-red-800">
                There are no saved documents available.
              </p>
              <p className="mt-2 text-gray-700">Please save some documents.</p>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-xl font-semibold text-gray-800">
                Are you sure?
              </h2>
              <p className="mt-2 text-gray-600">
                You are about to delete a saved document.
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-3 bg-green-600 text-white rounded-lg"
                  onClick={handleDelete}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SavedDocuments;

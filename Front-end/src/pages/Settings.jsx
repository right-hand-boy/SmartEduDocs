import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/Authcontext";
import PageTitle from "../utils/PageTitle";

function Settings() {
  const { user, userLogged } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateChanges = () => {
    if (name === user.name && email === user.email && !isChangingPassword) {
      toast.info("No changes detected.");
      return false;
    }
    if (isChangingPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateChanges()) return;

    if (isChangingPassword || email !== user.email) {
      setShowModal(true); // Prompt for old password verification
    } else {
      updateUserName();
    }
  };

  const updateUserName = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/profile/edit/name",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            name,
          }),
        }
      ).then((res) => res.json());

      if (response.ok || response.success) {
        userLogged({ ...user, name, email });
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(response.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const updateUserInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/profile/edit/info",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            name,
            email,
            oldPassword,
            newPassword,
          }),
        }
      ).then((res) => res.json());

      if (response.ok || response.success) {
        userLogged({
          ...user,
          name,
          email,
        });
        toast.success("Profile updated successfully!");
        setShowModal(false);
      } else {
        throw new Error(response.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  function resetForm() {
    setIsEditing(false);
    setIsChangingPassword(false);
    setConfirmPassword("");
    setNewPassword("");
  }

  const handleModalClose = () => {
    setShowModal(false);
    setIsChangingPassword(false);
    setOldPassword("");
  };

  return (
    <>
      <PageTitle title={"Settings - SmartEduDocs"} />
      <div className="bg-gray-100 md:self-center w-full">
        <div className="w-full md:max-w-4xl md:mx-auto bg-white shadow-md rounded-lg p-6">
          {/* User Info */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b pb-6 mb-6">
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="h-16 w-16 bg-brightGreen rounded-full flex items-center justify-center text-3xl font-bold text-white">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <h1 className="md:text-2xl text-lg font-semibold text-gray-800 capitalize">
                  {user.name}
                </h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-600">Role</p>
              <p className="text-brightGreen pb-1 border-b-2 capitalize">
                {user.role}
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label
                htmlFor="name"
                className="w-full sm:w-28 text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label
                htmlFor="email"
                className="w-full sm:w-28 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label
                htmlFor="password"
                className="w-full sm:w-28 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              {!isChangingPassword ? (
                <input
                  type="password"
                  id="password"
                  value="********"
                  disabled
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isEditing) setIsEditing(true);
                setIsChangingPassword(!isChangingPassword);
              }}
              className="text-sm text-green-600 hover:underline"
            >
              {isChangingPassword ? "Cancel" : "Change Password"}
            </button>
            <div className="flex justify-end gap-4 mt-6">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition"
                >
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    loading
                      ? "bg-gray-400"
                      : "bg-brightGreen hover:bg-green-600 text-white"
                  } transition`}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </form>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-80 sm:w-96">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Confirm Old Password
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter your current password to save changes.
              </p>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleModalClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={updateUserInfo}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    loading
                      ? "bg-gray-400"
                      : "bg-brightGreen hover:bg-green-600 text-white"
                  } transition`}
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Settings;

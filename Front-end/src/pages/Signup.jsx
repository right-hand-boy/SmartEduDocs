import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import PageTitle from "../utils/PageTitle";
import Icons from "../svg/Icons";
function Signup() {
  const navigate = useNavigate();
  const { userLogged } = useAuth();
  const [email, setEmail] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const signUpHandler = async (e) => {
    e.preventDefault();
    if (!password || !email || !confirmedPassword) {
      toast.error("all field are requied");
      return;
    }
    // else if () {

    // }
    else if (password !== confirmedPassword) {
      toast.error("confirmed password doesn't match");
      return;
    }
    try {
      const formdata = JSON.stringify({
        email,
        password: confirmedPassword,
      });
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formdata,
      }).then((res) => res.json());
      let userDetail;
      console.log(response);
      if (response.success) {
        userDetail = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        };
        userLogged(userDetail);
        navigate("/");
      } else {
        toast.error(response.data.error || "failled to sign");
      }
    } catch (error) {
      toast.error("failled to sign up");
      return;
    }
  };
  return (
    <>
      <PageTitle title={"Sign Up -SmartEduDocs"} />
      <div className="min-h-screen flex items-center justify-center bg-[url('/bgg.jpg')] bg-gray-300 bg-cover bg-center">
        <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg backdrop-blur-md max-w-sm w-full">
          <Logo />
          <h3 className="text-xl font-semibold text-black text-center mb-4">
            Sign Up
          </h3>
          <form onSubmit={(e) => signUpHandler(e)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-950 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className="w-full px-4 py-2 text-black  bg-white opacity-50  placeholder:text-black rounded-lg focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-950 mb-1"
              >
                Password
              </label>
              <div className="w-full relative">
                <input
                  type={isVisiblePassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="w-full px-4 py-2 text-black  bg-white opacity-50  placeholder:text-black rounded-lg focus:outline-none"
                  placeholder="Enter your password"
                />
                <span
                  onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                  className="text-brightGreen absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                >
                  {isVisiblePassword ? (
                    <Icons letter={"eye"} size={15} />
                  ) : (
                    <Icons letter={"eye-off"} size={15} />
                  )}
                </span>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-950 mb-1"
              >
                Confirm Password
              </label>

              <div className="w-full relative">
                <input
                  type={isVisibleConfirm ? "text" : "password"}
                  id="confirm-password"
                  value={confirmedPassword}
                  onChange={(e) => {
                    setConfirmedPassword(e.target.value);
                  }}
                  className="w-full px-4 py-2 text-black  bg-white opacity-50  placeholder:text-black rounded-lg focus:outline-none"
                  placeholder="Confirm your password"
                />
                <span
                  onClick={() => setIsVisibleConfirm(!isVisibleConfirm)}
                  className="text-brightGreen absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                >
                  {isVisibleConfirm ? (
                    <Icons letter={"eye"} size={15} />
                  ) : (
                    <Icons letter={"eye-off"} size={15} />
                  )}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-black py-2 rounded-lg hover:bg-green-700 transition focus:outline-none"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-sm text-gray-950 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import PageTitle from "../utils/PageTitle";
import Icons from "../svg/Icons";
function Login() {
  const [email, setEmail] = useState("");
  const [isVisible, setIsvisible] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { userLogged } = useAuth();
  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const formdata = JSON.stringify({
        email,
        password,
      });
      const link = rememberMe
        ? "http://localhost:8080/api/auth/login?rememberMe=true"
        : "http://localhost:8080/api/auth/login";
      const response = await fetch(link, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formdata,
      }).then((res) => res.json());

      let userDetail;
      if (response.success) {
        userDetail = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          ...(response.data.facultyId && {
            facultyId: response.data.facultyId,
          }),
        };
        userLogged(userDetail);
        if (response.data.token)
          localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        toast.error(response.data.error || "Login failed");
      }
    } catch (error) {
      console.error(e);
      toast.error("Login failed");
    }
  };

  return (
    <>
      <PageTitle title={"Login -SmartEduDocs"} />
      <div className="min-h-screen flex items-center justify-center bg-[url('/bgg.jpg')] bg-gray-300 bg-cover bg-center">
        <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg backdrop-blur-md max-w-sm w-full">
          <Logo />
          <h3 className="text-xl font-semibold text-black text-center mb-4">
            Login
          </h3>

          <form onSubmit={(e) => loginHandler(e)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                name="email"
                className="w-full px-4 py-2 bg-white opacity-50 text-black rounded-lg focus:outline-none placeholder:text-black"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <div className="w-full relative">
                <input
                  type={isVisible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  name="password"
                  className="w-full px-4 py-2 bg-white opacity-50  placeholder:text-black text-black rounded-lg focus:outline-none"
                  placeholder="Enter your password"
                />
                <span
                  onClick={() => setIsvisible(!isVisible)}
                  className="text-brightGreen absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                >
                  {isVisible ? (
                    <Icons letter={"eye"} size={15} />
                  ) : (
                    <Icons letter={"eye-off"} size={15} />
                  )}
                </span>
              </div>
            </div>
            <label className="my-3 pl-1 flex items-center text-black text-sm">
              <input
                type="checkbox"
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2 accent-green-500"
              />
              Remember me
            </label>
            <button
              type="submit"
              className="w-full bg-green-600 text-black py-2 rounded-lg hover:bg-green-700 transition"
            >
              Log In
            </button>
          </form>
          <p className="text-center text-sm text-gray-950 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;

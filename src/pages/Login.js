import React, { useState,useContext } from "react";
import { json, Link, useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline, IoReturnDownBack } from "react-icons/io5";
import CustomButton from "../component/CustomButton";
import { UserContext } from '../component/Context';
import attendance1 from '../asset/attendance1.avif';
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const LoginPage = () => {

  const { setUser, setAuthToken } = useContext(UserContext);

  const navigate = useNavigate();
  const [showPassword, setShowpassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Email must be valid");
      return;
    }

    const credentials = {
      username: email,
      password: password,
    };

    setLoading(true);
    setErrorMessage("");

    try {
      // Perform Login API Request (one API for both validation and login)
      const loginUrl = 'http://10.0.20.57:8080/v1/auth/login/'; // Login API URL
      const loginResponse = await axios.post(loginUrl, credentials);
      if(loginResponse.status === 200){
        const {name, email,token} = loginResponse.data.data;
        setUser({name, email})
        localStorage.setItem('token',JSON.stringify(token))
        
      }

      const token = loginResponse.data.data.token; // Extract token from login response
      console.log('Login successful, token:', token);
      console.log(loginResponse.data)

      // Store token in localStorage or sessionStorage
      localStorage.setItem("authToken", token); // Use sessionStorage if you want it to last only for the session

     
      // handleAlertmodal(); // Show success modal
      toast.success('Login Successful')
      setLoading(false); // Stop loading
      
      // // Assuming login is successful, navigate to the main page
       navigate('/branches'); // Update '/main' with your desired route

    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false); // Stop loading
      let errorMessage = error.response.data.message || "Something went wrong";
      if (errorMessage === 'Invalid username or password'){
        errorMessage = 'Invalid email or password'
      }
      toast.error(errorMessage)
      // setErrorMessage(errorMessage); // Set error message
    }

  };

  return (
    <>
      <div className="flex items-center w-full font-lato h-screen relative">

        <ToastContainer/>

        <div className="flex-1 w-full px-7">
          <div className="w-full lg:w-[380px] sm:w-[450px] m-auto h-full">
            <p className="text-center text-4xl font-semibold my-4">Log In</p>
            <div id="error" className="text-red-600">{errorMessage}</div>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-lg">Email</label>
                <div className="relative mt-2 rounded-md">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    className="w-[100%] border text-12 py-3 pl-6 pr-16 text-lightgray bg-inputBg rounded-md outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-lg">Password</label>
                <div className="relative mt-2 rounded-md">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="w-[100%] border text-12 py-3 pl-6 pr-16 text-lightgray bg-inputBg rounded-md outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute inset-y-0 right-6 flex items-center cursor-pointer"
                    onClick={() => setShowpassword(!showPassword)}
                  >
                    <label htmlFor="password" className="sr-only">Toggle Visibility</label>
                    {showPassword ? (
                      <IoEyeOutline className="h-full w-6 text-[#5F5F5F]" />
                    ) : (
                      <IoEyeOffOutline className="h-full w-6 text-[#5F5F5F]" />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <CustomButton
                  title={loading ? "Please Wait..." : "Login"}
                  customClassname="w-full py-3 text-[#ECECEC] text-black bg-yellow-200 rounded-md mt-5"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="hidden flex-1 lg:flex h-full w-full">
          <div className="w-full flex h-full p-3">
            <img
              src={attendance1}
              alt="login-img"
              className="rounded-2xl w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
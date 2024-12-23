import React, { useState, useEffect, useRef,useContext } from 'react';
import MainPageNav1 from '../component/MainPageNav1';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../component/Context';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from 'axios';


const MainPage1 = () => {

  const { user } = useContext(UserContext);


  // const [user, setUser] = useState('');
  const [loading, setLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(true);
  const webcamRef = useRef(null);

  useEffect(() => {
    const formatDate = () => {
      const date = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };
    setCurrentDate(formatDate());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    setIsCameraVisible(true);
    startBarcodeScanning('clockIn'); // Pass clock-in type to scanning function
  };

  const handleClockOut = () => {
    setIsCameraVisible(true);
    startBarcodeScanning('clockOut'); // Pass clock-out type to scanning function
  };

  const startBarcodeScanning = (type) => {
    const scanInterval = setInterval(() => {
      captureAndScanBarcode(scanInterval, type);
    }, 1000);
  };

  const captureAndScanBarcode = (scanInterval, type) => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        // useEffect(() => {
        //   // Assume you fetch the logged-in user's info here, e.g., from an API or localStorage
        //   const fetchUserInfo = async () => {
        //     try {
        //       const response = await axios.get('http://your-api-url/api/user/profile'); // Replace with your user profile endpoint
        //       setUser(response.data); // Assuming response.data contains user info with email and name
        //     } catch (error) {
        //       console.error('Failed to fetch user info:', error);
        //     }
        //   };
      
        //   fetchUserInfo();
        // }, []);

        const handleCheckInRequest = async (qrCodeToken) => {
          setLoading(true); // Show loader
          console.log(user.email)

          try {
            const response = await axios.post('https://sterlingobservability-sterlingbankng.msappproxy.net/attendance-api/api/attendance/checkin', {
              qr_code_token: qrCodeToken,
              email: user?.email, // Update with the correct email if dynamic
              name: user?.name,
              device_id: '883839921812928jdj' // Update if the device ID is dynamic
              
            });

            if (response.status === 200) {
              toast.success('Check-in successful!');
              setIsClockedIn(true); // Update clock-in status
            }
          } catch (error) {
            console.error('Check-in failed:', error);
            toast.error(error.response.data.message);
          }finally{
            setLoading(false); // Hide loader after request completes
          }
        };

        const handleCheckOutRequest = async (qrCodeToken) => {
          setLoading(true); // Show loader
        
          try {
            const response = await axios.post('https://sterlingobservability-sterlingbankng.msappproxy.net/attendance-api/api/attendance/checkout', {
              qr_code_token: qrCodeToken,
              email: user.email, // Update with the correct email if dynamic
              // name: 'Jimoh Junior',
              device_id: '883839921812928jdj' // Update if the device ID is dynamic
            });
            if (response.status === 200) {
              toast.success('Check-out successful!');
              setIsClockedIn(false); // Update clock-in status
            }
          } catch (error) {
            console.error('Check-out failed:', error);
            toast.error(error.response.data.message)
          }finally{
            setLoading(false); // Hide loader after request completes
          }
        };
        
        if (code) {
          clearInterval(scanInterval); // Stop scanning once QR code is found
          setLoading(true); // Start loading before processing
          if (type === 'clockIn') {
            // alert(`Scan Complete, Checking in Progress`);
            handleCheckInRequest(code.data); // Call the check-in function with the scanned QR code
            setIsClockedIn(true);
            console.log('john is a boy')
          } else {
            // alert(`Scan Complete, Checking out Progress`);
            handleCheckOutRequest(code.data); // Call the check-out function with the scanned QR code
            setIsClockedIn(false);
          }
          setIsCameraVisible(false); // Hide camera after successful scan
        }
      };
    }
  };

  const toggleCamera = () => {
    setIsCameraVisible(false);
    setTimeout(() => {
      setUseFrontCamera(!useFrontCamera);
      setIsCameraVisible(true);
    }, 100);
  };

  return (
    <div>
      <MainPageNav1 />


      <div className="border h-[90vh] flex justify-center items-center bg-gray-800">
        <ToastContainer 
           position="top-right"
           style={{ top: '70px' }} // Moves the toast down by 50px
        />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="flex items-center">
                  <svg className="animate-spin h-10 w-10 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a12 12 0 100 24v-4a8 8 0 01-8-8z"></path>
                  </svg>
                  <span className="text-lg text-gray-700">Loading...</span>
                </div>
              </div>
            )}

        <div className="w-[350px] rounded-lg px-4 py-16 bg-black">
          <p className="text-center text-gray-500">{currentDate}</p>

          <div className="flex justify-center mt-8">
            <p className="rounded-3xl py-1 px-4 text-blue-300 bg-gray-800">{currentTime}</p>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between">
            <button
              className={`w-[45%] py-3 rounded-full ${isClockedIn ? 'bg-gray-500' : 'bg-red-500 text-white'}`}
              disabled={isClockedIn}
              onClick={handleClockIn}
            >
              {isClockedIn ? 'Clocked In' : 'Clock In'}
            </button>
            <button
              className={`w-[45%] py-3 rounded-full ${!isClockedIn ? 'bg-gray-500' : 'bg-blue-500 text-white'}`}
              disabled={!isClockedIn}
              onClick={handleClockOut}
            >
              {isClockedIn ? 'Clock Out' : 'Clocked Out'}
            </button>
          </div>

          {isCameraVisible && (
            <div className="flex flex-col items-center mt-4">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                audio={false}
                width={300}
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: useFrontCamera ? 'user' : 'environment'
                }}
              />
              <button onClick={toggleCamera} className="mt-2 text-white bg-blue-500 px-4 py-2 rounded">
                Switch Camera
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage1;

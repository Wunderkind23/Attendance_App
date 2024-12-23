import React, { useState, useEffect, useContext } from 'react';
import MainPageNav1 from '../component/MainPageNav1';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../component/Context';
import axios from 'axios';

const Branch = () => {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [error, setError] = useState('');
  const [clockoutmodal, setClockoutModal] = useState(false);
  const [workDescription, setWorkDescription] = useState('');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position)
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError('Failed to fetch location. Please enable location service.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };


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

  // Fetch clock-in status
  const fetchClockStatus = async () => {
    try {
      const response = await axios.get(`http://10.0.20.57:3008/api/attendance/status/${user?.email}`);
      if (response.data.status === 'Clocked In') {
        setIsClockedIn(true);
      } else {
        setIsClockedIn(false);
      }
    } catch (error) {
      console.error('Failed to fetch clock status:', error);
      toast.error('Failed to fetch clock status');
    }
  };

  // Fetch branches for the dropdown
  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://10.0.20.57:3008/api/branches');
      const branchList = response.data.data.map((item) => ({
        id: item.id,
        name: item.branch_name || 'Unknown Branch',
      }));
      setBranches(branchList);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      toast.error('Failed to fetch branches');
    }
  };

  useEffect(() => {
    fetchClockStatus();
    fetchBranches();
    getLocation();
  }, []);

  const handleClockIn = async () => {
    if (!selectedBranch) {
      toast.error('Please select a branch');
      return;
    }

    if (!location.latitude || !location.longitude) {
      toast.error('Please fetch your location first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://10.0.20.57:3008/api/attendance/checkin', {
        email: user?.email,
        name: user?.name,
        device_id: '883839921812928jdj',
        branch_id: selectedBranch,
        geolocation: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      if (response.status === 200) {
        toast.success('Check-in successful!');
        setIsClockedIn(true);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Check-in failed:', error);
      toast.error(error.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!workDescription) {
      toast.error('Please provide a description of your work before clocking out');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://10.0.20.57:3008/api/attendance/checkout', {
        email: user?.email,
        device_id: '883839921812928jdj',
        checkout_summary: workDescription,
        geolocation: {
        latitude: 38.8951,
        longitude: -77.0364,
        address: "Washington DC"
      }
      });

      if (response.status === 200) {
        toast.success('Check-out successful!');
        setIsClockedIn(false);
        setWorkDescription(''); // Clear description after successful clock-out
        setClockoutModal(false); // Close modal
      }
    } catch (error) {
      console.error('Check-out failed:', error);
      toast.error(error.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <MainPageNav1 />

      <div className="border h-[90vh] flex justify-center items-center bg-gray-800">
        <ToastContainer position="top-right" style={{ top: '70px' }} />

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
              onClick={() => setShowModal(true)}
            >
              {isClockedIn ? 'Clocked In' : 'Clock In'}
            </button>
            <button
              className={`w-[45%] py-3 rounded-full ${!isClockedIn ? 'bg-gray-500' : 'bg-blue-500 text-white'}`}
              disabled={!isClockedIn}
              onClick={() => setClockoutModal(true)}
            >
              {isClockedIn ? 'Clock Out' : 'Clock Out'}
            </button>
          </div>
        </div>
      </div>

      {clockoutmodal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
            <h2 className="text-lg font-bold mb-4">Work Description</h2>
            <textarea
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              rows="4"
              placeholder="Enter a short description of your work"
            />
            <div className="flex justify-end mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setClockoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleClockOut}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
            <h2 className="text-lg font-bold mb-4">Select Branch</h2>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">Select a Branch</option>
              {branches?.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleClockIn}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branch;

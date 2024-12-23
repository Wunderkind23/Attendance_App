// utils/geolocation.js
export const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(error.message);
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };
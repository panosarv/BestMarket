import { useEffect, useState } from "react";

const useGeolocation = (address) => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: {
      lat: "",
      lng: "",
    },
  });

  useEffect(() => {
    if (!address) return;
    if (address == "Current location, Current city, Current shipping code" ) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            loaded: true,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } else {
      const fetchGeolocation = async () => {
        const url = `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${address}&language=en`;
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "63d90d3c47mshd96f7dac6e1a9e2p165bfbjsn1d6846a8e5e7",
            "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
          },
        };

        try {
          const response = await fetch(url, options);
          const result = await response.json();
          const { lat, lng } = result.results[0].location;
          setLocation({
            loaded: true,
            coordinates: { lat, lng },
          });
        } catch (error) {
          setLocation({
            loaded: true,
            error,
          });
        }
      };

      fetchGeolocation();
    }
  }, [address]);

  return location;
};

export default useGeolocation;

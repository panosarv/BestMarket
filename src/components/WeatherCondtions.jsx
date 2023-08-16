import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap,Marker,Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import '../styles/WeatherConditions.css'


function WeatherConditions() {
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const concatCords = `${latitude},${longitude}`;
            setLocation(concatCords);
            console.log("Location",location)
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const fetchWeatherConditions = async () => {
    

  try {
    if(location){
      const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`;
      console.log('URL:',url)
      const options = {
      method: 'GET',
        headers: {
          'X-RapidAPI-Key': '63d90d3c47mshd96f7dac6e1a9e2p165bfbjsn1d6846a8e5e7',
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };
      const response = await fetch(url, options);
	    const result = await response.json();
      const currentCondition = result.current.condition.text;
      setCondition(currentCondition);
      setLoading(false);
	    console.log("Result",result);
    }
    } catch (error) {
    console.error("error");
    }
    };

    fetchWeatherConditions();
  }, [location]);

  

  if (loading) {
    return <div>Loading weather conditions...</div>;
  }

  return (
    <div className="weather-board">
      <h2>Current Weather Conditions</h2>
      <p>{`The weather is ${condition}.`}</p>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
    </MapContainer>
    </div>
  );
}

export default WeatherConditions;
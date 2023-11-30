import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap,Marker,Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import '../styles/WeatherConditions.css'
import useGeolocation from '../hooks/useGeolocation';

function WeatherConditions({address}) {
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useGeolocation(address);
  console.log('location:',location)
  const concatLocation = location.coordinates.lat + ',' + location.coordinates.lng;

  useEffect(() => {
    const fetchWeatherConditions = async () => {
    

  try {
    if(location){
      const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${concatLocation}`;
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
    return <div className='loading'>Loading weather conditions...</div>;
  }

  return (
    <div className="weather-board">
      <h2>Current Weather Conditions</h2>
      <p>{`The weather is ${condition}.`}</p>
      {location.loaded && !location.error && (
      <MapContainer center={[location.coordinates.lat,location.coordinates.lng]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.coordinates.lat,location.coordinates.lng]}>

      </Marker>
    </MapContainer>
      )}
    </div>
  );
}

export default WeatherConditions;
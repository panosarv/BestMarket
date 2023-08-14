import React, { useEffect, useState } from 'react';

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
            setLocation(`${latitude},${longitude}`);
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
        if (location) {
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location}`
          );
          const data = await response.json();
          const currentCondition = data.current.condition.text;
          setCondition(currentCondition);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching weather conditions:', error);
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
    </div>
  );
}

export default WeatherConditions;
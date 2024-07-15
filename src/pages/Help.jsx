import React, { useState, useEffect } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../styles/Help.css';

const getIconColor = (frequency, maxFrequency) => {
  const ratio = frequency / maxFrequency;
  if (ratio > 0.66) return 'red';
  if (ratio > 0.33) return 'yellow';
  return 'green';
};

const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const userLocationIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/User_icon-cp.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const Help = () => {
  const [messages, setMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [maxFrequency, setMaxFrequency] = useState(1); // Initialize with 1 to avoid division by zero
  const [userLocation, setUserLocation] = useState({ lat: 38.246639, lng: 21.734573 }); // Default to example coordinates

  const predefinedResponses = {
    "What does BestMarket consider when making a recommendation?": "Our algorithm considers the cost of your groceries, the time of the day, the weather condition present, the distance from each supermarket, the rating of each supermarket, and your means of transport before making a recommendation. This ensures a variety of factors are considered to give you the best recommendation possible.",
    "Can you show me all the supermarkets in my area and how frequently are they suggested?": "Yes certainly! Here is a map of the supermarkets in your area and how frequently they are suggested based on their color coding.",
    "I need additional support": "For any additional requests please contact us at: +30 6969696969 or bestmarket@info-invalid.com"
  };

  useEffect(() => {
    const welcomeMessage = { text: "Welcome to BestMarket! How can I assist you today? (Please choose one of the options below).", isBot: true };
    setMessages([welcomeMessage]);
    setShowOptions(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const handleOptionClick = async (option) => {
    if (option === "Can you show me all the supermarkets in my area and how frequently are they suggested?") {
      setShowMap(true);
      const response = await fetch("https://bestmarket-server.onrender.com/api/heatmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${sessionStorage.getItem("accesstoken")}`,
        },
        body: JSON.stringify({
          user_location: userLocation,
        }),
      });
      const data = await response.json();
      setHeatmapData(data);
      const maxFreq = Math.max(...data.map(item => item.count));
      setMaxFrequency(maxFreq);
    }

    setMessages(prevMessages => [
      ...prevMessages,
      { text: `${option}`, isBot: false },
      { text: predefinedResponses[option], isBot: true }
    ]);
    setShowOptions(false);
  };

  const handleBackClick = () => {
    setMessages(prevMessages => prevMessages.slice(0, 1));
    setShowOptions(true);
    setShowMap(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-content">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.isBot ? 'bot-message' : 'user-message'}`}
            >
              {message.text}
            </div>
          ))}
          {showOptions && (
            <ListGroup className="options-list">
              {Object.keys(predefinedResponses).map((option) => (
                <ListGroup.Item
                  key={option}
                  action
                  onClick={() => handleOptionClick(option)}
                  className="option-item"
                >
                  {option}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
        {showMap && (
          <div className="map-container">
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} scrollWheelZoom={false}
            sx={
                {
                    height: "100%",
                    width: "100%",
                    sm:{
                        width:"90%",
                        height:"90%"
                    }
                }
                
            }>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {heatmapData.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.lat, location.lng]}
                  icon={createIcon(getIconColor(location.count, maxFrequency))}
                >
                  <Popup>
                    Supermarket {index + 1}<br />Frequency: {location.count}
                  </Popup>
                </Marker>
              ))}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                <Popup>
                  Your location
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
        {!showOptions && (
          <Button variant="secondary" onClick={handleBackClick} className="back-button">
            Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default Help;

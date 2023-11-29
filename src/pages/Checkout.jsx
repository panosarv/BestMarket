import React, { useState } from 'react';
import '../styles/Checkout.css'
import WeatherConditions from '../components/WeatherCondtions';

function Checkout() {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event)  => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
    <div className="checkout-container">
      <div className="radio-container">
        <div>
          <label style={{marginRight: '3px'}} htmlFor='car'>Car</label>
          <input
            type="radio"
            id="car"
            value="0"
            checked={selectedOption === 'car'}
            onChange={handleOptionChange}
          />
          <br/>
          <label style={{marginRight: '3px'}} htmlFor="motocycle">Motocycle</label>
          <input
            type="radio"
            id="motocycle"
            value="1"
            checked={selectedOption === 'motocycle'}
            onChange={handleOptionChange}
          />
          <br/>
          <label style={{marginRight: '3px'}} htmlFor="Bike">Bike</label>
          <input
            type="radio"
            id="bike"
            value="2"
            checked={selectedOption === 'motocycle'}
            onChange={handleOptionChange}
          />
          <br/>
          <label style={{marginRight: '3px'}} htmlFor="foot">By foot</label>
          <input
            type="radio"
            id="foot"
            value="3"
            checked={selectedOption === 'foot'}
            onChange={handleOptionChange}
          />
          <br/>
          <label style={{marginRight: '3px'}} htmlFor="public">Public transportation</label>
          <input
            type="radio"
            id="public"
            value="4"
            checked={selectedOption === 'public'}
            onChange={handleOptionChange}
          />
        </div>
      </div>
  
      <WeatherConditions />
    </div>
    </>
  );
}

export default Checkout;
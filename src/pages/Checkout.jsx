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
    <div className="radio-container">
      <div>
        <label style={{marginRight: '3px'}} htmlFor='car'>Car</label>
        <input
          type="radio"
          id="car"
          value="car"
          checked={selectedOption === 'car'}
          onChange={handleOptionChange}
        />
        <br/>
        <label style={{marginRight: '3px'}} htmlFor="motocycle">Motocycle</label>
        <input
          type="radio"
          id="motocycle"
          value="motocycle"
          checked={selectedOption === 'motocycle'}
          onChange={handleOptionChange}
        />
      <br/>
        <label style={{marginRight: '3px'}} htmlFor="foot">By foot</label>
        <input
          type="radio"
          id="foot"
          value="foot"
          checked={selectedOption === 'foot'}
          onChange={handleOptionChange}
        />
        <br/>
        <label style={{marginRight: '3px'}} htmlFor="public">Public transportation</label>
        <input
          type="radio"
          id="public"
          value="public"
          checked={selectedOption === 'public'}
          onChange={handleOptionChange}
        />
      </div>
    </div>
 
    <WeatherConditions />
    </>
  );
}

export default Checkout;
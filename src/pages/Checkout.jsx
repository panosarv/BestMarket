import React, { useState } from 'react';
import '../styles/Checkout.css'
import WeatherConditions from '../components/WeatherCondtions';

function Checkout() {
  const [selectedOption, setSelectedOption] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [city,setCity]=useState('')
  const [address,setAddress]=useState('')
  const [shippingCode,setShippingCode]=useState('')
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
            checked={selectedOption === '0'}
            onChange={handleOptionChange}
          />
          <br/>
          <label style={{marginRight: '3px'}} htmlFor="motocycle">Motocycle</label>
          <input
            type="radio"
            id="motocycle"
            value="1"
            checked={selectedOption === '1'}
            onChange={handleOptionChange}
          />
          <br/>
          <label style={{marginRight: '3px'}} htmlFor="Bike">Bike</label>
          <input
            type="radio"
            id="bike"
            value="2"
            checked={selectedOption === '2'}
            onChange={handleOptionChange}
          />
          <br/>
          <label style={{marginRight: '3px'}} htmlFor="foot">By foot</label>
          <input
            type="radio"
            id="foot"
            value="3"
            checked={selectedOption === '3'}
            onChange={handleOptionChange}
          />
          <br/>
          <label style={{marginRight: '3px'}} htmlFor="public">Public transportation</label>
          <input
            type="radio"
            id="public"
            value="4"
            checked={selectedOption === '4'}
            onChange={handleOptionChange}
          />
        </div>
      </div>
      {!isFormSubmitted && (
        <form onSubmit={(e) => { e.preventDefault(); 
        setIsFormSubmitted(true);
        setAddress(e.target.elements.address.value);
        setCity(e.target.elements.city.value);
        setShippingCode(e.target.elements.shippingCode.value) }}>
          <label>
            Shipping Code:
            <input type="text" name="shippingCode" />
          </label>
          <label>
            Address:
            <input type="text" name="address" />
          </label>
          <label>
            City:
            <input type="text" name="city" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      )}

      {isFormSubmitted && <WeatherConditions address={`${address}, ${city}, ${shippingCode}`}/>}
      
    </div>
    </>
  );
}

export default Checkout;
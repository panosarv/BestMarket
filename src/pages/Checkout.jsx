import React, { useState,useEffect,useRef,useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import '../styles/Checkout.css'
import WeatherConditions from '../components/WeatherCondtions';
import { useShoppingCart } from "../context/ShoppingCartContext"
import CartItem from "../components/CartItem"
import {Stack} from "react-bootstrap"


function Checkout() {
  const {weatherData}=useContext(WeatherContext)
  const {closeCart,cartItems,cartQuantity}=useShoppingCart()
  const [selectedOption, setSelectedOption] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [city,setCity]=useState('')
  const [address,setAddress]=useState('')
  const [shippingCode,setShippingCode]=useState('')
  const handleOptionChange = (event)  => {
    setSelectedOption(event.target.value);
  };
  const submitButtonRef=useRef(null);
 
  useEffect(() => {
    const handleClick = async () => {
      const meansOfTransport = selectedOption;
      const radius = selectedOption === '3' ? 3 : 10;
      const {lat,lng,condition}=weatherData
      const location = {lat,lng};
      const arrayOfItems = cartItems;
      const weatherCondition = condition;
      console.log(location)
      const response = await fetch('http://localhost:3000/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          arrayOfItems,
          meansOfTransport,
          location,
          radius,
          weatherCondition
        })
      });
   
      const data = await response.json();
      console.log(data);
    };
    if(submitButtonRef.current)
    submitButtonRef.current.addEventListener('click', handleClick);
   
    return () => {
      if (submitButtonRef.current)
      submitButtonRef.current.removeEventListener('click', handleClick);
    };
   }, [selectedOption, weatherData, city, shippingCode, cartItems]);

  return (
    <>
    <div className="checkout-container">
      <div className="radio-container">
        <h3>Choose your method of transport</h3>
          <label className="radio-item"style={{marginRight: '3px'}} htmlFor='car'>Car
            <input
              type="radio"
              id="car"
              value="0"
              checked={selectedOption === '0'}
              onChange={handleOptionChange}
            />
          </label>
            <br/>

          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="motocycle">Motocycle
            <input
              type="radio"
              id="motocycle"
              value="1"
              checked={selectedOption === '1'}
              onChange={handleOptionChange}
            />
            </label>
            <br/>
          

          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="Bike">Bike
            <input
              type="radio"
              id="bike"
              value="2"
              checked={selectedOption === '2'}
              onChange={handleOptionChange}
            />
          </label>
          <br/>

          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="foot">By foot
            <input
              type="radio"
              id="foot"
              value="3"
              checked={selectedOption === '3'}
              onChange={handleOptionChange}
            />
          </label>
          <br/>
          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="public">Public transportation
            <input
              type="radio"
              id="public"
              value="4"
              checked={selectedOption === '4'}
              onChange={handleOptionChange}
            />
          </label>
      </div>
      {!isFormSubmitted && (
        <form className="form-container" onSubmit={(e) => { e.preventDefault(); 
        setIsFormSubmitted(true);
        setAddress(e.target.elements.address.value);
        setCity(e.target.elements.city.value);
        setShippingCode(e.target.elements.shippingCode.value) }}>
        <h3>Fill your location</h3>
          <div>
          <label>
            Shipping Code:
            <input className="form-item" type="text" name="shippingCode" />
          </label>
        </div>
        <div>
          <label>
            Address:
            <input className="form-item" type="text" name="address" />
          </label>
        </div>
        <div>
          <label>
            City:
            <input className="form-item" type="text" name="city" />
          </label>
        </div>
        <input type="submit" value="Submit" />
        </form>
      )}

      {isFormSubmitted && <WeatherConditions address={`${address}, ${city}, ${shippingCode}`}/>}
      <div className="cart-container">
        <h3>Review your cart</h3>
        {cartItems.length===0? (<div className="text-center">Your cart is empty</div> ):(
        <Stack gap={3}>
              {cartItems.map(item=>
              <CartItem key={item.id} {...item}/>)}
        </Stack>
        )}
        {isFormSubmitted && cartItems.length>0 && <button className='search-button' ref={submitButtonRef}>Search</button>}
      </div>
    </div>
    </>
    
  );
}

export default Checkout;
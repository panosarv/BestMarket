import React, { useState,useEffect,useRef,useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import '../styles/Checkout.css'
import WeatherConditions from '../components/WeatherCondtions';
import { useShoppingCart } from "../context/ShoppingCartContext"
import CartItem from "../components/CartItem"
import {Stack,Card} from "react-bootstrap"
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { MapContainer, TileLayer, useMap,Marker,Popup } from 'react-leaflet'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Padding } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';


function Checkout() {
  const {weatherData}=useContext(WeatherContext)
  const {closeCart,cartItems,cartQuantity}=useShoppingCart()
  const [selectedOption, setSelectedOption] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [city,setCity]=useState('')
  const [heatmap,setHeatmap]=useState([])
  const [recommendedSupermarkets, setRecommendedSupermarkets] = useState([]);
  const [address,setAddress]=useState('')
  const [shippingCode,setShippingCode]=useState('')
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOptionChange = (event)  => {
    setSelectedOption(event.target.value);
  };
  const handleSupermarketClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSupermarketClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const submitButtonRef=useRef(null);
  const steps = [
    'Add your groceries',
    'Fill aditional information',
    'Find the the best market!',
  ];
  useEffect(() => {
    const handleClick = async () => {
      const meansOfTransport = selectedOption;
      const radius = selectedOption === '3' ? 3 : 10;
      const {lat,lng,condition}=weatherData
      const location = {lat,lng};
      
      const arrayOfItems = cartItems;
      const weatherCondition = condition;
      console.log(location)
      console.log('Authorization', `${localStorage.getItem('accessToken')}`)
      const response = await fetch('http://localhost:3000/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          arrayOfItems,
          weatherCondition,
          meansOfTransport,
          location,
          radius
        })
      });
      const data = await response.json();
      console.log(data);  
      setRecommendedSupermarkets(data);
      const heatmapResponse = await fetch('http://localhost:3000/api/heatmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          user_location: location
        })
      });
      const heatmapData = await heatmapResponse.json();
      console.log('heatMapData',heatmapData[0].user_lat)
      setHeatmap(heatmapData);
    };
    if(submitButtonRef.current)
    submitButtonRef.current.addEventListener('click', handleClick);
   
    return () => {
      if (submitButtonRef.current)
      submitButtonRef.current.removeEventListener('click', handleClick);
    };
   }, [selectedOption, weatherData, city, shippingCode, cartItems]);

  return (
    <div >
    
    <div className="checkout-container">
      
      <div className="radio-container">
        <h3>Choose your method of transport</h3>
          <label className="radio-item"style={{marginRight: '3px'}} htmlFor='car'>Car
            <input
              type="radio"
              id="car"
              value="car"
              checked={selectedOption === 'car'}
              onChange={handleOptionChange}
            />
          </label>
            <br/>

          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="motocycle">Motocycle
            <input
              type="radio"
              id="motocycle"
              value="motorbike"
              checked={selectedOption === 'motorbike'}
              onChange={handleOptionChange}
            />
            </label>
            <br/>
          

          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="Bike">Bike
            <input
              type="radio"
              id="bike"
              value="bike"
              checked={selectedOption === 'bike'}
              onChange={handleOptionChange}
            />
          </label>
          <br/>

          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="foot">By foot
            <input
              type="radio"
              id="foot"
              value="walking"
              checked={selectedOption === 'walking'}
              onChange={handleOptionChange}
            />
          </label>
          <br/>
          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="public">Public transportation
            <input
              type="radio"
              id="public"
              value="public"
              checked={selectedOption === 'public'}
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
    <div style={{display:'flex'}}>
    { recommendedSupermarkets.length && heatmap.length&&(
      <div className='recommendation-container'>
        <h3>Recommended Supermarkets</h3>
          
          <div className="col supermarket-cards-container">
            {recommendedSupermarkets.map((supermarket) => (
              <div>
              <div className="row-md-3 mb-3 change-cursor supermarket-recommendation-container" key={supermarket.supermarketId}>
                <Card style={{ width: '10rem' }} onClick={handleSupermarketClick}>
                  <Card.Img variant="top" src={supermarket.image} alt={supermarket.name} />
                  
                </Card>
                <div style={{backgroundColor:'white'}}>
                  <div style={{display:'flex'}}>
                  Rating:<Rating name="read-only" value={supermarket.rating} readOnly precision={0.1}/>
                  </div>

                  

                </div>
                

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleSupermarketClose}
                  anchorOrigin={{
                    vertical: 'mid',
                    horizontal: 'right',
                  }}
                >
              <Typography sx={{ p: 2 }}>Name: {supermarket.name} Rating:{supermarket.rating}, Cost:{supermarket.cost}, </Typography>
              <MapContainer center={[supermarket.latitude,supermarket.longitude]} zoom={13} scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[supermarket.latitude,supermarket.longitude]}>
                    <Popup>
                      {supermarket.name}
                    </Popup>
                  </Marker>
                  <Marker position={[heatmap[0].user_lat,heatmap[0].user_lng]}>
                    <Popup>
                      Your location
                    </Popup>
                  </Marker>
              </MapContainer>
              </Popover>
              
              
              </div>
              <Divider style={{width:'50vw'}}>
                  <Chip label={supermarket.category} size='small' />
                </Divider>
              </div>
            ))}
          </div>
        
      </div>
      )}
    <Divider  orientation='vertical' flexItem >
      <Chip label="Recommended Supermarkets" size='small' orientation='vertocal' />
    </Divider>
    {heatmap.length && <MapContainer center={[heatmap[0].user_lat,heatmap[0].user_lng]} zoom={13} scrollWheelZoom={false} style={{width:'50vw',marginRight:'2em'}}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[heatmap[0].user_lat,heatmap[0].user_lng]}>
                    <Popup>
                      Your location
                    </Popup>
                  </Marker>
                  {heatmap.map((item) => {
                    return (
                      <Marker position={[item.lat, item.lng]} style={{color:'red'}}>
                        <Popup>
                          {`Supermarket count: ${item.count}`}
                        </Popup>
                      </Marker>
                    );
                  })
                }
    </MapContainer>
  }
    </div>
    </div>
    
  );
}

export default Checkout;
import React, { useState,useEffect,useRef,useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import '../styles/Checkout.css'
import WeatherConditions from '../components/WeatherCondtions';
import { useShoppingCart } from "../context/ShoppingCartContext"
import CartItem from "../components/CartItem"
import {Stack,Card} from "react-bootstrap"
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { MapContainer, TileLayer, useMap,Marker,Popup, Circle } from 'react-leaflet'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Padding } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';



function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const {weatherData}=useContext(WeatherContext)
  const {closeCart,cartItems,cartQuantity}=useShoppingCart()
  const [selectedOption, setSelectedOption] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [city,setCity]=useState('')
  const [heatmap,setHeatmap]=useState([])
  const [recommendedSupermarkets, setRecommendedSupermarkets] = useState([]);
  const [address,setAddress]=useState('')
  const [shippingCode,setShippingCode]=useState('')
  const [anchorEl, setAnchorEl] = useState({});
  const [maxFrequency, setMaxFrequency] = useState(0);
  const [searchButtonClassName,setSearchButtonClassName]=useState('search-button')
  const handleOptionChange = (event)  => {
    setSelectedOption(event.target.value);
  };
  const handleSupermarketClick = (event, supermarketName) => {
    setAnchorEl({ ...anchorEl, [supermarketName]: event.currentTarget });
  };
  const handleSupermarketClose = (supermarketName) => {
    setAnchorEl({ ...anchorEl, [supermarketName]: null });
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
      setIsLoading(true);
      setRecommendedSupermarkets([]);
      setHeatmap([]);
      const meansOfTransport = selectedOption;
      const radius = selectedOption === '3' ? 3 : 10;
      const {lat,lng,condition}=weatherData
      const location = {lat,lng};
      setSearchButtonClassName('disabled-search-button')
      const arrayOfItems = cartItems;
      const weatherCondition = condition;
      console.log('Authorization', `${localStorage.getItem('accesstoken')}`)
      const response = await fetch('http://localhost:3000/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('accesstoken')}`,
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
      
      console.log('Rec Data:',data);  
      setRecommendedSupermarkets(data);
      const heatmapResponse = await fetch('http://localhost:3000/api/heatmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('accesstoken')}`,
        },
        body: JSON.stringify({
          user_location: location
        })
      });
      const heatmapData = await heatmapResponse.json();
      const totalCount = heatmapData.reduce((sum, item) => sum + item.count,  0);
      setMaxFrequency(totalCount);
      setHeatmap(heatmapData);
      setIsLoading(false);
      setSearchButtonClassName('search-button')
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

          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="motorbike">Motocycle
            <input
              type="radio"
              id="motorbike"
              value="motorbike"
              checked={selectedOption === 'motorbike'}
              onChange={handleOptionChange}
            />
            </label>
            <br/>
          

          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="bike">Bike
            <input
              type="radio"
              id="bike"
              value="bike"
              checked={selectedOption === 'bike'}
              onChange={handleOptionChange}
            />
          </label>
          <br/>

          <label className="radio-item" style={{marginRight: '3px'}} htmlFor="walking">By foot
            <input
              type="radio"
              id="walking"
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
        {isFormSubmitted && cartItems.length>0 && <button className={searchButtonClassName} disabled={searchButtonClassName=='search-button'?false:true} ref={submitButtonRef}>Search</button>}
      </div>
    </div>
    <div style={{display:'flex'}}>
    {recommendedSupermarkets.length==0 && isLoading &&
    <Stack spacing={2} style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
        {/* For variant="text", adjust the height via font-size */}
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

        {/* For other variants, adjust the size with `width` and `height` */}
        <Skeleton variant="rounded" style={{width:'90vw',height:'25vh',borderRadius:'3em'}} />
        <Skeleton variant="rounded" style={{width:'90vw',height:'25vh',marginTop:'2em',borderRadius:'3em'}} />
    
     </Stack>}
    { recommendedSupermarkets.length>0 && heatmap.length>0&&(
      <div className='recommendation-container'>
        <h3>Recommended Supermarkets</h3>
          
          <div className="col supermarket-cards-container">
            {recommendedSupermarkets.map((supermarket) => (
              <div>
              <div className="row-md-3 mb-3 mt-3 change-cursor supermarket-recommendation-container" style={{width:'32vw'}} key={supermarket.supermarketid}>
                <Card  style={{width:'50vw'}}onClick={(event)=>handleSupermarketClick(event,supermarket.category)}>
                  <Card.Img variant="top" src={supermarket.image} alt={supermarket.name} />
                  
                </Card>
                <div style={{backgroundColor:'white',width:'100vw',paddingLeft:'2em'}}>
                  <div style={{display:'flex',flexDirection:'column'}}>
                    <Card.Title>{supermarket.name}</Card.Title>
                    <Card.Text>Cost: {Math.round(supermarket.cost *  100) /  100} E</Card.Text>
                  Rating:<Rating name="read-only" value={supermarket.rating} readOnly precision={0.1}/>
                  </div>

                  

                </div>
                

              <Popover
                  id={`popover-${supermarket.category}`}
                  open={Boolean(anchorEl[supermarket.category])}

                  anchorEl={anchorEl[supermarket.category]}
                  onClose={() => handleSupermarketClose(supermarket.category)}
                  anchorOrigin={{
                    vertical: 'mid',
                    horizontal: 'right',
                  }}
                >
              <MapContainer style={{width:'25vw'}}center={[supermarket.latitude,supermarket.longitude]} zoom={13} scrollWheelZoom={false}>
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
              <Divider style={{width:'100%'}}>
                  <Chip label={supermarket.category} size='small' />
                </Divider>
              </div>
            ))}
          </div>
        
      </div>
      )}
    {heatmap.length>0 && 
    <div style={{display:'flex'}}>
      <Divider  orientation='vertical' flexItem >
        <Chip label="Analytics" size='small' orientation='vertocal' />
      </Divider>
      <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:'center'}}>
      <h3 style={{marginTop:'3vh'}}>Previous Recommendations:</h3>
      <MapContainer center={[heatmap[0].user_lat,heatmap[0].user_lng]} zoom={13} scrollWheelZoom={false} style={{width:'50vw',marginRight:'2em'}}>
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
            
            <Circle center={[item.lat, item.lng]} pathOptions={{ color: getColorFromFrequency(item.count/maxFrequency)  }} radius={700} >
            <Marker position={[item.lat, item.lng]}>
              <Popup>
                {`Supermarket frequency: ${Math.round(((item.count / maxFrequency) *  100 + Number.EPSILON) *  100) /  100}%`}
              </Popup>
            </Marker>
            </Circle>
          );
        })
      }
    </MapContainer>
    </div>
    </div>
  }
    </div>
    </div>
    
  );
}

function getColorFromFrequency(frequency) {
  // Define the color spectrum with RGB values
  const colorSpectrum = [
    { freq:  0, color: { r:  0, g:  0, b:  255 } }, // Blue
    { freq:  0.5, color: { r:  0, g:  255, b:  0 } }, // Green
    { freq:  1, color: { r:  255, g:  0, b:  0 } } // Red
  ];

  // Find the two closest colors in the spectrum
  let lowerBound = colorSpectrum.find(cs => cs.freq <= frequency);
  let upperBound = colorSpectrum.find(cs => cs.freq >= frequency);

  // Calculate the interpolation factor
  const interpolationFactor = (frequency - lowerBound.freq) / (upperBound.freq - lowerBound.freq);

  // Perform the interpolation
  const rgbResult = {
    r: Math.round(lowerBound.color.r + (upperBound.color.r - lowerBound.color.r) * interpolationFactor),
    g: Math.round(lowerBound.color.g + (upperBound.color.g - lowerBound.color.g) * interpolationFactor),
    b: Math.round(lowerBound.color.b + (upperBound.color.b - lowerBound.color.b) * interpolationFactor)
  };

  // Return the result as an RGB string
  return `rgb(${rgbResult.r}, ${rgbResult.g}, ${rgbResult.b})`;
}

export default Checkout;


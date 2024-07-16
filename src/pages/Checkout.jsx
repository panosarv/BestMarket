import React, { useState, useEffect, useRef, useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import "../styles/Checkout.css";
import WeatherConditions from "../components/WeatherCondtions";
import { useShoppingCart } from "../context/ShoppingCartContext";
import CartItem from "../components/CartItem";
import { Stack, Card } from "react-bootstrap";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Drawer, IconButton, FormControlLabel, Checkbox, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from '@mui/icons-material/Download';import L from "leaflet";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {RobotoRegular} from "../utilities/RobotoRegular";
import logo from '/bm-hr-icon.29c1c3ff.png'; // Adjust the path as needed


// Define custom icons
const userLocationIcon = L.icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/User_icon-cp.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const recommendedSupermarketIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const nearestSupermarketIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const cheapestSupermarketIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const { weatherData } = useContext(WeatherContext);
  const { closeCart, cartItems, cartQuantity, clearCart } = useShoppingCart();
  const [selectedOption, setSelectedOption] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [city, setCity] = useState("");
  const [heatmap, setHeatmap] = useState([]);
  const [recommendedSupermarkets, setRecommendedSupermarkets] = useState([]);
  const [address, setAddress] = useState("");
  const [shippingCode, setShippingCode] = useState("");
  const [anchorEl, setAnchorEl] = useState({});
  const [maxFrequency, setMaxFrequency] = useState(0);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkOutContainerClass, setCheckOutContainerClass] = useState("checkout-container");
  const [searchButtonClassName, setSearchButtonClassName] = useState("search-button");
  const [showMap, setShowMap] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showYourLocation, setShowYourLocation] = useState(true);
  const [showRecommendedSupermarket, setShowRecommendedSupermarket] = useState(true);
  const [showNearestSupermarket, setShowNearestSupermarket] = useState(false);
  const [showCheapestSupermarket, setShowCheapestSupermarket] = useState(false);
  const [tempCart, setTempCart] = useState([]); // New state for saving the cart

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSupermarketClick = (event, supermarketName) => {
    setAnchorEl({ ...anchorEl, [supermarketName]: event.currentTarget });
  };

  const handleSupermarketClose = (supermarketName) => {
    setAnchorEl({ ...anchorEl, [supermarketName]: null });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const submitButtonRef = useRef(null);

  const checkFormValidity = () => {
    const allFieldsFilled = address && city && shippingCode;
    setIsFormValid(isFormDisabled || allFieldsFilled);
  };

  const toggleFormDisabled = () => {
    setIsFormDisabled(!isFormDisabled);
    if (!isFormDisabled) {
      setAddress("");
      setCity("");
      setShippingCode("");
    }
    checkFormValidity();
  };

  useEffect(() => {
    checkFormValidity();
  }, [address, city, shippingCode, isFormDisabled]);

  useEffect(() => {
    const handleClick = async () => {
      setTempCart(cartItems); // Save the cart items before clearing
      setCheckOutContainerClass("checkout-container-disappear");
      clearCart();
      setIsLoading(true);
      setRecommendedSupermarkets([]);
      setHeatmap([]);
      const meansOfTransport = selectedOption;
      const radius = selectedOption === "3" ? 3 : 10;
      const { lat, lng, condition } = weatherData;
      const location = { lat, lng };
      setSearchButtonClassName("disabled-search-button");
      const arrayOfItems = cartItems;
      const weatherCondition = condition;
      const response = await fetch("https://bestmarket-server.onrender.com/api/recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          arrayOfItems,
          weatherCondition,
          meansOfTransport,
          location,
          radius,
        }),
      });
      const data = await response.json();

      setRecommendedSupermarkets(data);
      const heatmapResponse = await fetch("https://bestmarket-server.onrender.com/api/heatmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${sessionStorage.getItem("accesstoken")}`,
        },
        body: JSON.stringify({
          user_location: location,
        }),
      });
      const heatmapData = await heatmapResponse.json();
      const totalCount = heatmapData.reduce((sum, item) => sum + item.count, 0);
      setMaxFrequency(totalCount);
      setHeatmap(heatmapData);
      setIsLoading(false);
      setSearchButtonClassName("search-button");
      setShowMap(true);
    };
    if (submitButtonRef.current)
      submitButtonRef.current.addEventListener("click", handleClick);

    return () => {
      if (submitButtonRef.current)
        submitButtonRef.current.removeEventListener("click", handleClick);
    };
  }, [selectedOption, weatherData, city, shippingCode, cartItems]);

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add the font file
    doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
  
    // Add the image
    const img = new Image();
    img.src = logo;
    img.onload = function() {
      doc.addImage(img, 'PNG',10, 20,180,30); // Adjust the coordinates and size as needed
  
      // Add the title
      
  
      // Add the subtitle
      doc.setFontSize(24);
      doc.setFont('Roboto', 'normal');
      doc.text("Grocery List", 105, 60, { align: 'center' });
  
      // Add the cart items
      doc.setFontSize(12);
      tempCart.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name}`, 10, 80 + (index * 10));
      });
  
      // Save the PDF
      doc.save("BestMarket-groceries.pdf");
    };
  };
  

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    arrows: true,
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    switch (name) {
      case "showYourLocation":
        setShowYourLocation(checked);
        break;
      case "showRecommendedSupermarket":
        setShowRecommendedSupermarket(checked);
        break;
      case "showNearestSupermarket":
        setShowNearestSupermarket(checked);
        break;
      case "showCheapestSupermarket":
        setShowCheapestSupermarket(checked);
        break;
      default:
        break;
    }
  };

  const getDirections = (lat, lng) => {
    const userLat = weatherData.lat;
    const userLng = weatherData.lng;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}`;
    window.open(directionsUrl, "_blank");
  };

  return (
    <div>
      <div className={checkOutContainerClass}>
        <div className="radio-container">
          <h3>Choose your method of transport</h3>
          <label className="radio-item" style={{ marginRight: "3px" }} htmlFor="car">
            Car
            <input type="radio" id="car" value="car" checked={selectedOption === "car"} onChange={handleOptionChange} />
          </label>
          <br />
          <label className="radio-item" style={{ marginRight: "3px" }} htmlFor="motorbike">
            Motorcycle
            <input type="radio" id="motorbike" value="motorbike" checked={selectedOption === "motorbike"} onChange={handleOptionChange} />
          </label>
          <br />
          <label className="radio-item" style={{ marginRight: "3px" }} htmlFor="bike">
            Bike
            <input type="radio" id="bike" value="bike" checked={selectedOption === "bike"} onChange={handleOptionChange} />
          </label>
          <br />
          <label className="radio-item" style={{ marginRight: "3px" }} htmlFor="walking">
            By foot
            <input type="radio" id="walking" value="walking" checked={selectedOption === "walking"} onChange={handleOptionChange} />
          </label>
          <br />
          <label className="radio-item" style={{ marginRight: "3px" }} htmlFor="public">
            Public transportation
            <input type="radio" id="public" value="public" checked={selectedOption === "public"} onChange={handleOptionChange} />
          </label>
        </div>
        {!isFormSubmitted && (
          <form className="form-container" onSubmit={(e) => {
            e.preventDefault();
            setIsFormSubmitted(true);
            if (isFormDisabled) {
              setAddress("Current location");
              setCity("Current city");
              setShippingCode("Current shipping code");
            } else {
              setAddress(e.target.elements.address.value);
              setCity(e.target.elements.city.value);
              setShippingCode(e.target.elements.shippingCode.value);
            }
          }}>
            <h3>Fill your location</h3>
            <div>
              <label>
                Shipping Code:
                <input className="form-item" type="text" name="shippingCode" value={shippingCode} onChange={(e) => setShippingCode(e.target.value)} disabled={isFormDisabled} />
              </label>
            </div>
            <div>
              <label>
                Address:
                <input className="form-item" type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isFormDisabled} />
              </label>
            </div>
            <div>
              <label>
                City:
                <input className="form-item" type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} disabled={isFormDisabled} />
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" onChange={toggleFormDisabled} />
                Use current location
              </label>
            </div>
            {isFormValid && <input type="submit" value="Submit" />}
          </form>
        )}

        {isFormSubmitted && <WeatherConditions address={`${address}, ${city}, ${shippingCode}`} />}
        <div className="cart-container">
          <h3>Review your cart</h3>
          {cartItems.length === 0 ? (
            <div className="text-center">Your cart is empty</div>
          ) : (
            <Stack gap={3}>
              {cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </Stack>
          )}
          {isFormSubmitted && cartItems.length > 0 && (
            <button className={searchButtonClassName} disabled={searchButtonClassName === "search-button" ? false : true} ref={submitButtonRef}>
              Search
            </button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {recommendedSupermarkets.length === 0 && isLoading && (
          <Stack spacing={2} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="rounded" style={{ width: "90vw", height: "25vh", borderRadius: "3em" }} />
            <Skeleton variant="rounded" style={{ width: "90vw", height: "25vh", marginTop: "2em", borderRadius: "3em" }} />
          </Stack>
        )}

        {recommendedSupermarkets.length > 0 && heatmap.length > 0 && (
          <div className="recommendation-container">
            <h3>Recommended Supermarkets</h3>
            <Slider {...settings}>
              {recommendedSupermarkets.map((supermarket) => (
                <div>
                  <div className="row-md-3 mb-3 mt-3 change-cursor supermarket-recommendation-container" style={{ width: "32vw" }} key={supermarket.supermarketid}>
                    <Card style={{ width: "50vw" }} onClick={(event) => handleSupermarketClick(event, supermarket.category)}>
                      <Card.Img variant="top" src={supermarket.image} alt={supermarket.name} />
                    </Card>
                    <div style={{ backgroundColor: "white", width: "100vw", paddingLeft: "2em" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Card.Title>{supermarket.name}</Card.Title>
                        <Card.Text>
                          Cost: {Math.round(supermarket.cost * 100) / 100} €
                        </Card.Text>
                        Rating:
                        <Rating name="read-only" value={supermarket.rating} readOnly precision={0.1} />
                      </div>
                    </div>
                    <Popover id={`popover-${supermarket.category}`} open={Boolean(anchorEl[supermarket.category])} anchorEl={anchorEl[supermarket.category]} onClose={() => handleSupermarketClose(supermarket.category)} anchorOrigin={{ vertical: "mid", horizontal: "right" }}>
                      <MapContainer className="map-container" center={[supermarket.latitude, supermarket.longitude]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[supermarket.latitude, supermarket.longitude]} icon={recommendedSupermarketIcon}>
                          <Popup>
                            {supermarket.name}
                            <br />
                            <Button variant="contained" color="primary" onClick={() => getDirections(supermarket.latitude, supermarket.longitude)}>
                              Get Directions
                            </Button>
                          </Popup>
                        </Marker>
                        <Marker position={[heatmap[0].user_lat, heatmap[0].user_lng]} icon={userLocationIcon}>
                          <Popup>Your location</Popup>
                        </Marker>
                      </MapContainer>
                    </Popover>
                  </div>
                  <Divider style={{ width: "100%" }}>
                    <Chip label={supermarket.category} size="small" />
                  </Divider>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {showMap && recommendedSupermarkets.length > 0 && (
          <div style={{ position: "relative", width: "100%" }}>
            <MapContainer
                center={[recommendedSupermarkets[0].latitude, recommendedSupermarkets[0].longitude]}
                zoom={13}
                scrollWheelZoom={false}
                className="map-container"
                sx={{
                  height: "400px",
                  width: "100%",
                  marginTop: "20px",
                  sm: { height: "300px", width: "90%" },
                }}
              >

              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {showYourLocation && (
                <Marker position={[weatherData.lat, weatherData.lng]} icon={userLocationIcon}>
                  <Popup>You are here</Popup>
                </Marker>
              )}
              {showRecommendedSupermarket && (
                <Marker position={[recommendedSupermarkets[0].latitude, recommendedSupermarkets[0].longitude]} icon={recommendedSupermarketIcon}>
                  <Popup>
                    Recommended Supermarket
                    <br />
                    <Button variant="contained" color="primary" onClick={() => getDirections(recommendedSupermarkets[0].latitude, recommendedSupermarkets[0].longitude)}>
                      Get Directions
                    </Button>
                  </Popup>
                </Marker>
              )}
              {showNearestSupermarket && recommendedSupermarkets.filter((item) => item.category === 'nearest').map((supermarket) => (
                <Marker position={[supermarket.latitude, supermarket.longitude]} key={supermarket.supermarketid} icon={nearestSupermarketIcon}>
                  <Popup>
                    Nearest Supermarket
                    <br />
                    <Button variant="contained" color="primary" onClick={() => getDirections(supermarket.latitude, supermarket.longitude)}>
                      Get Directions
                    </Button>
                  </Popup>
                </Marker>
              ))}
              {showCheapestSupermarket && recommendedSupermarkets.filter((item) => item.category === 'cheapest').map((supermarket) => (
                <Marker position={[supermarket.latitude, supermarket.longitude]} key={supermarket.supermarketid} icon={cheapestSupermarketIcon}>
                  <Popup>
                    Cheapest Supermarket
                    <br />
                    <Button variant="contained" color="primary" onClick={() => getDirections(supermarket.latitude, supermarket.longitude)}>
                      Get Directions
                    </Button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <IconButton style={{ position: "absolute", top: 20, right: 20, backgroundColor: "white", border: "1px solid grey", borderRadius: "5px", zIndex: 1000 }} onClick={toggleDrawer(true)}>
              <FilterListIcon />
            </IconButton>
            {tempCart.length > 0 && (
              <IconButton onClick={generatePDF} className="download-button" style={{ position: 'absolute', top: 60, right: 20, zIndex: 1000, backgroundColor: "white", border: "1px solid grey", borderRadius: "5px",marginTop:"2px"}}>
               <DownloadIcon />
              </IconButton>
            )}
          </div>
        )}
      </div>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div style={{ width: 250, padding: 20, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" gutterBottom>
            Filter Options
          </Typography>
          <FormControlLabel control={<Checkbox checked={showYourLocation} onChange={handleCheckboxChange} name="showYourLocation" />} label="Your location" />
          <FormControlLabel control={<Checkbox checked={showRecommendedSupermarket} onChange={handleCheckboxChange} name="showRecommendedSupermarket" />} label="Recommended supermarket" />
          <FormControlLabel control={<Checkbox checked={showNearestSupermarket} onChange={handleCheckboxChange} name="showNearestSupermarket" />} label="Nearest supermarket" />
          <FormControlLabel control={<Checkbox checked={showCheapestSupermarket} onChange={handleCheckboxChange} name="showCheapestSupermarket" />} label="Cheapest supermarket" />
        </div>
      </Drawer>
    </div>
  );
}

export default Checkout;

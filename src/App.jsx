import './styles/App.css'
import {Route,Routes} from "react-router-dom"
import {Container} from "react-bootstrap"
import Home from "./pages/Home"
import Account from "./pages/Account"
import Help from "./pages/Help"
import Navbar from './components/Navbar'
import Checkout from './pages/Checkout'
import ProductDetailPage from './pages/ProductDetailPage';
import Profile from './pages/Profile'
import{ShoppingCartProvider} from "./context/ShoppingCartContext"
import { WeatherContext } from './context/WeatherContext'
import { useState } from 'react'

function App() {
  const [weatherData,setWeatherData]=useState({lat:null,lng:null,condition:''})
  return (
    <div className="App">
      <WeatherContext.Provider value={{weatherData,setWeatherData}}>
      <ShoppingCartProvider>
      <Navbar />
      <Container className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/help" element={<Help />} />
          <Route path="/checkout" element={<Checkout />}/>
          <Route path="/category/:category" element={<ProductDetailPage />}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </Container>
      </ShoppingCartProvider>
      </WeatherContext.Provider>
      </div>
   
  )
}

export default App

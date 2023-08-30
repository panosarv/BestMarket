import './styles/App.css'
import {Route,Routes} from "react-router-dom"
import {Container} from "react-bootstrap"
import Home from "./pages/Home"
import Account from "./pages/Account"
import Help from "./pages/Help"
import Navbar from './components/Navbar'
import Checkout from './pages/Checkout'
import ProductDetailPage from './pages/ProductDetailPage';
import{ShoppingCartProvider} from "./context/ShoppingCartContext"


function App() {

  return (
    <div className="App">
      <ShoppingCartProvider>
      <Navbar />
      <Container className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/help" element={<Help />} />
          <Route path="/checkout" element={<Checkout />}/>
          <Route path="/product/:id" element={<ProductDetailPage />}/>
        </Routes>
      </Container>
      </ShoppingCartProvider>
      </div>
   
  )
}

export default App

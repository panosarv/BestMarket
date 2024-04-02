import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Stack } from 'react-bootstrap';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CartItem from "../components/CartItem"

import '../styles/Profile.css';

function Profile() {
 const [editMode, setEditMode] = useState(false);
 const [selectedCart, setSelectedCart] = useState(null);
 const [cartProducts, setCartProducts] = useState([]);
 const handleEditClick = () => {
    setEditMode(!editMode);
 };

 const handleCartClick = (cartId) => {
    setSelectedCart(selectedCart === cartId ? null : cartId);
 };

 const fetchCartProducts = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('User ID not found in localStorage');
    return;
  }
  console.log('userId:', userId)
  try {
    const response = await fetch('http://localhost:3000/api/getCartProductsUserId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart products');
    }

    const data = await response.json();
    console.log('data:', data);
    setCartProducts(data); // Update state with fetched cart products
  } catch (error) {
    console.error('Error fetching cart products:', error);
  }
};
useEffect(() => {
  fetchCartProducts();
}
, []);


 return (
    <div>
    <div className="profile-page">
      <Card className="mb-3">
        <Card.Header>Profile Information</Card.Header>
        <Card.Body>
          <Card.Title>{editMode ? <input type="text" defaultValue="John Doe" /> : 'John Doe'}</Card.Title>
          <Card.Text>
            {editMode ? <input type="email" defaultValue="john.doe@example.com" /> : 'john.doe@example.com'}
            <br />
            {editMode ? <input type="password" defaultValue="******" /> : '******'}
          </Card.Text>
          <Button onClick={handleEditClick}>{editMode ? 'Save' : 'Edit'}</Button>
        </Card.Body>
      </Card>

      <Card className='mb-3'>
        <Card.Header>Current Location</Card.Header>
        <Card.Body>
            <p>Address: 123 Main St</p>
        </Card.Body>
      </Card>
    </div>
    <Card className="mb-3">
        <Card.Header>Saved Carts</Card.Header>
        {cartProducts.map((cart, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography>Cart {index + 1}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Render cart items here */}
              <Typography>
                {/* Example: Displaying product names */}
                <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
                {cart.categories.map((category) => (
                  <div>
                    <img src={category.image} alt="item-img" style={{width:"125px",height:"75px",
                    objectFit:"cover"}} />
                    <div className="me-auto">
                        <div>{category.name}
                        </div>
                    </div>
                  </div>
                ))}
                {cart.products.map((product) => (
                  <div>
                  <img src={product.image} alt="item-img" style={{width:"125px",height:"75px",
                  objectFit:"cover"}} />
                  <div className="me-auto">
                      <div>{product.name}
                      </div>
                  </div>
                </div>
                ))}
                </Stack>
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Card>
  </div>
 );
}

export default Profile;
import React, { useEffect, useState } from 'react';
import { Card, Button, Table } from 'react-bootstrap';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Accordion 1
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          Accordion 2
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Accordion Actions
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
        <AccordionActions>
          <Button>Cancel</Button>
          <Button>Agree</Button>
        </AccordionActions>
      </Accordion>
  </Card>
  </div>
 );
}

export default Profile;
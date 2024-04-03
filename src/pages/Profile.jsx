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
 const [draggedCart, setDraggedCart] = useState(null);
 const [isDragging, setIsDragging] = useState(false);
 const handleEditClick = () => {
    setEditMode(!editMode);
 };
 const handleDragStart = (event, cartId) => {
  setDraggedCart(cartId);
  setIsDragging(true);
};
const handleDragEnd = () => {
  setDraggedCart(null);
  setIsDragging(false); // End dragging
}
const handleDragOver = (event) => {
  event.preventDefault(); // Necessary to allow dropping
};

const handleDrop = (event, targetCartId) => {
  event.preventDefault();
  if (draggedCart !== null && draggedCart !== targetCartId) {
    const targetCartIndex = cartProducts.findIndex((cart) => cart.cartid === targetCartId);
    const draggedCartIndex = cartProducts.findIndex((cart) => cart.cartid === draggedCart);
    if (targetCartIndex !== -1 && draggedCartIndex !== -1) {
      const userConfirmationWindown = window.confirm('Are you sure you want to merge the carts?');
      if (!userConfirmationWindown) {
        return;
      }
      let updatedCategories = [...cartProducts[targetCartIndex].categories];
      let updatedProducts = [...cartProducts[targetCartIndex].products];

      // Iterate over the categories in the dragged cart
      cartProducts[draggedCartIndex].categories.forEach(draggedCategory => {
        // Check if the category already exists in the target cart
        const categoryExists = updatedCategories.some(category => category.categoryid === draggedCategory.categoryid);

        // If the category does not exist in the target cart, add it
        if (!categoryExists) {
          updatedCategories.push(draggedCategory);
        }
      });

      // Iterate over the products in the dragged cart
      cartProducts[draggedCartIndex].products.forEach(draggedProduct => {
        // Check if the product already exists in the target cart
        const productExists = updatedProducts.some(product => product.productid === draggedProduct.productid);

        // If the product does not exist in the target cart, add it
        if (!productExists) {
          updatedProducts.push(draggedProduct);
        }
      });

      // Update the state with the merged items
      setCartProducts(prevCartProducts => {
        const newCartProducts = [...prevCartProducts];
        newCartProducts[targetCartIndex] = {
          ...newCartProducts[targetCartIndex],
          categories: updatedCategories,
          products: updatedProducts,
        };

        // Optionally, remove the dragged cart from the state
        // newCartProducts.splice(draggedCartIndex, 1);

        return newCartProducts;
      });
    }
 }
  setDraggedCart(null); // Reset the dragged cart
  setIsDragging(false); // End dragging
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
          <Accordion key={index}
          draggable
          onDragStart={(event) => handleDragStart(event, cart.cartid)}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDrop={(event) => handleDrop(event, cart.cartid)}
          className={isDragging && cart.cartid !== draggedCart ? 'drag-highlight' : ''} // Conditionally apply class
          >
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
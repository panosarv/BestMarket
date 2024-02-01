import React, { useState } from 'react';
import { Card, Button, Table } from 'react-bootstrap';
import '../styles/Profile.css';

function Profile() {
 const [editMode, setEditMode] = useState(false);
 const [selectedCart, setSelectedCart] = useState(null);

 const handleEditClick = () => {
    setEditMode(!editMode);
 };

 const handleCartClick = (cartId) => {
    setSelectedCart(selectedCart === cartId ? null : cartId);
 };

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
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Cart Name</th>
        </tr>
      </thead>
      <tbody>
        <tr onClick={() => handleCartClick(1)} className={selectedCart === 1 ? "expanded" : ""}>
          <td>Cart 1</td>
        </tr>
        {selectedCart === 1 && (
          <tr>
            <td colSpan="1">
              <div className="cart-details">
                <p>Items:</p>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
              </div>
            </td>
          </tr>
        )}
        <tr onClick={() => handleCartClick(2)} className={selectedCart === 2 ? "expanded" : ""}>
          <td>Cart 2</td>
        </tr>
        {selectedCart === 2 && (
          <tr>
            <td colSpan="1">
              <div className="cart-details">
                <p>Items:</p>
                <ul>
                  <li>Item 3</li>
                  <li>Item 4</li>
                </ul>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </Card>
  </div>
 );
}

export default Profile;
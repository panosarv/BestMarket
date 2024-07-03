import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, TextField, Box, Typography, Container } from '@mui/material';
import { useShoppingCart } from "../context/ShoppingCartContext";
import '../styles/SubCategoryDetailPage.css';
import ProductCard from '../components/ProductCard';

function SubCategoryDetailPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const { category: categoryId } = useParams();
  const { getItemQuantity, increaseCartQuantity } = useShoppingCart();
  
  useEffect(() => {
    if (categoryId) {
      fetch(`https://bestmarket-server.onrender.com/api/category/${categoryId}`)
        .then(response => response.json())
        .then(data => { 
          console.log(data[0]);
          setCategory(data[0]);
        });
    }
  }, [categoryId]);

  useEffect(() => {
    console.log('useEffect triggered');
    if (categoryId) {
      fetch(`https://bestmarket-server.onrender.com/api/subcategory/${categoryId}`)
        .then(response => response.json())
        .then(data => { 
          console.log(data);
          setSubCategories(data);
        });
    }
  }, [categoryId]);
  
  if (!subCategories || !category) {
    return (<div>Loading...</div>);
  }

  const filteredSubCategories = subCategories.filter(subCategory => subCategory.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container className="subCategory-detail" maxWidth="lg">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <img src={category.image} alt={category.name} className="category-image" />
        <Typography variant="h3" component="h1" className="category-title">{category.name}</Typography>
        <Typography variant="body1" className="category-description">{category.description}</Typography>
        <TextField 
          label="Search" 
          variant="outlined" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="search-field"
        />
        <Grid container spacing={3} className="product-grid">
          {filteredSubCategories.map(subCategory => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={subCategory.subcategoryid}>
              <ProductCard {...subCategory} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default SubCategoryDetailPage;

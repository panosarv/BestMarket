import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, TextField, Box, Typography, Card, CardMedia, CardContent } from '@mui/material'; // import Box for centering
import { useShoppingCart } from "../context/ShoppingCartContext";
import '../styles/ProductDetailPage.css';

function ProductDetailPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const { subcategory: categoryId } = useParams(); // get the category id from the URL
  const { getItemQuantity, increaseCartQuantity } = useShoppingCart();
  
  useEffect(() => {
    if(categoryId){
      fetch(`https://bestmarket-server.onrender.com/api/category/${categoryId}`)
        .then(response => response.json())
        .then(data => { 
          console.log(data[0]);
          setCategory(data[0]);
        });
    }
  }, [categoryId]);

  useEffect(() => {
    console.log('useEffect triggered'); // add this line to check if the hook is being triggered multiple times
    if(categoryId){
      fetch(`https://bestmarket-server.onrender.com/api/product/${categoryId}`)
        .then(response => response.json())
        .then(data => { 
          console.log(data);
          setProducts(data); // add each product to the products array
        });
    }
  }, [categoryId]);
  
  if (!products || !category) {
    return (<div>Loading...</div>)
  }

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className="product-detail" sx={{ padding: 2 }}>
      <Box sx={{ textAlign: 'center', marginBottom: 4, maxWidth: '600px', width: '100%' }}>
        <img src={category.image} alt={category.name} />
        <Typography variant="h1" component="h1">
          {category.name}
        </Typography>
        <Typography variant="body1">
          {category.description}
        </Typography>
      </Box>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-bar"
      />
      {console.log("products: ", products)}
      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item key={product.productid} xs={12} sm={6} md={4} lg={3}>
            <Card className="product-card">
              <CardMedia
                component="img"
                alt={product.name}
                image={product.image}
                title={product.name}
              />
              <CardContent className="product-card-content">
                <Typography variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  className="add-to-cart"
                  style={{backgroundColor:"#5f816f"}}
                  onClick={(event) => { event.stopPropagation(); increaseCartQuantity(product); }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductDetailPage;

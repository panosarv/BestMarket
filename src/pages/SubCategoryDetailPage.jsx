import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, TextField, Box } from '@mui/material'; // import Box for centering
import { useShoppingCart } from "../context/ShoppingCartContext";
import '../styles/SubCategoryDetailPage.css';

function SubCategoryDetailPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const { category: categoryId } = useParams(); // get the category id from the URL
  const { getItemQuantity,increaseCartQuantity } = useShoppingCart();
  
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
    fetch(`https://bestmarket-server.onrender.com/api/subcategory/${categoryId}`)
      .then(response => response.json())
      .then(data => { 
        console.log(data);
        setSubCategories(data); // add each subCategory to the subCategories array
        
        
      });
  }
}, [categoryId]);
  
  if(!subCategories || !category) {
    return (<div>Loading...</div>)
  }

  const filteredSubCategories = subCategories.filter(subCategory => subCategory.name.toLowerCase().includes(search.toLowerCase()));



  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className="subCategory-detail"> {/* use Box for centering */}
      <img src={category.image} alt={category.name} />
      <h1>{category.name}</h1>
      <p>{category.description}</p>
      <TextField label="Search" variant="outlined" value={search} onChange={e => setSearch(e.target.value)} />
      {console.log("subCategories: ",subCategories)}  
      <Grid style={{marginTop:"2em"}} container spacing={3}>
        {filteredSubCategories.map(subCategory => (
          <Grid item xs={12} sm={6} md={4} lg={3} sx={{textAlign:{xs:'center'}}}>
            <Box display="flex" flexDirection="column" height="100%">
              <div key={subCategory.categoryid}>
                <img src={subCategory.image} alt={subCategory.name} />
                <h1>{subCategory.name}</h1>
                <Button size="small" variant="contained" style={{backgroundColor:"#5f816f"}} className="add-to-cart" onClick={(event)=>{event.stopPropagation(); increaseCartQuantity(subCategory);}}>
                  Add to Cart
                </Button>
              </div>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SubCategoryDetailPage;
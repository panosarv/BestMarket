import "../styles/MainStore.css"
import ProductCard from "./ProductCard";
import {Container, Row, Col} from "react-bootstrap";
import {Stack, Paper,IconButton} from "@mui/material"
import { styled } from '@mui/material/styles';
import IcecreamIcon from '@mui/icons-material/Icecream';
import LiquorIcon from '@mui/icons-material/Liquor';
import SetMealIcon from '@mui/icons-material/SetMeal';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import HealingIcon from '@mui/icons-material/Healing';
import SoapIcon from '@mui/icons-material/Soap';
import Grid from '@mui/material/Grid'; 
import { useState,useEffect } from "react";
import Skeleton from '@mui/material/Skeleton';




const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth:150
  }));

 
  

function MainStore(){
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true)
        fetch('https://bestmarket-server.onrender.com/api/mainstore')
            .then(response => response.json())
            .then(data => 
              {
                console.log('data',data)
                setItems(data)
                setIsLoading(false)
              }
              );
    }, []);

    const handleCategorySelect = (category) => {
      const newSelectedCategories = [...selectedCategories];
      if (newSelectedCategories.includes(category)) {
        newSelectedCategories.splice(
          newSelectedCategories.findIndex((item) => item === category),
          1
        );
      } else {
        newSelectedCategories.push(category);
      }
      setSelectedCategories(newSelectedCategories);
    };
    const steps = [
        'Add your groceries',
        'Fill aditional information',
        'Find the the best market!',
      ];
    
    return(
        <Container className="mainstore">
            <Stack direction="row" className="filters-container" gap={0}>
               
                <IconButton onClick={() => handleCategorySelect('DairyEggs')} style={{boxShadow: selectedCategories.includes('DairyEggs') ? 'inset 0 0 5px #5f816f' : 'none',borderRadius:'10px'}}><Item><IcecreamIcon/>Dairy & Eggs</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('Liquers')} style={{boxShadow: selectedCategories.includes('Liquers') ? 'inset 0 0 5px #5f816f' : 'none',borderRadius:'10px'}}><Item><LiquorIcon/>Liquers</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('Frozen')} style={{boxShadow: selectedCategories.includes('Frozen') ? 'inset 0 0 5px #5f816f' : 'none',borderRadius:'10px'}}><Item><SetMealIcon/>Frozen</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('FreshlyBaked')} style={{boxShadow: selectedCategories.includes('FreshlyBaked') ? 'inset 0 0 5px #5f816f' : 'none',borderRadius:'10px'}}><Item><BakeryDiningIcon/>Freshly Baked</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('MeatFish')} style={{boxShadow: selectedCategories.includes('MeatFish') ? 'inset 0 0 5px #5f816f' : 'none',borderRadius:'10px'}}><Item><KebabDiningIcon/>Meat & Fish</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('HealthBeauty')} style={{boxShadow: selectedCategories.includes('HealthBeauty') ? 'inset 0 0 5px #5f816f' : 'none',borderRadius:'10px'}}><Item><HealingIcon/>Health & Beauty</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('Cleaning')} style={{boxShadow: selectedCategories.includes('Cleaning') ? 'inset 0 0 5px #5f816f' : 'none',borderRadius:'10px'}}><Item><SoapIcon/>Cleaning</Item></IconButton>
               
                
            </Stack>
            
            <div className="products-wrapper">
                
                {isLoading && (
                <div className="items-wrapper">
                  <Stack spacing={2} style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="rounded" style={{width:'70vw',height:'25vh',borderRadius:'3em'}} />
                    <Skeleton variant="rounded" style={{width:'70vw',height:'25vh',marginTop:'2em',borderRadius:'3em'}} />
                
                </Stack>
                </div>
                )}
                {!isLoading && (
                  <div className="items-wrapper">
                    <Grid container spacing={2}>
                      {items.filter(item => {
                        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.name);
                        return categoryMatch;
                      })
                    .map((item) => (
                        <Grid className="extend-card-on-mobile" item xs={12} sm={6} md={4} key={item.categoryid}>
                          <ProductCard  {...item} />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                )}
            </div>
        </Container>

    )
}
export default MainStore
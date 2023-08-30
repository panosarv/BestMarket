import "../styles/MainStore.css"
import ProductCard from "./ProductCard";
import {Container, Row, Col} from "react-bootstrap";
import {Stack, Paper,IconButton} from "@mui/material"
import items from "../data/items.json"
import { styled } from '@mui/material/styles';
import IcecreamIcon from '@mui/icons-material/Icecream';
import LiquorIcon from '@mui/icons-material/Liquor';
import SetMealIcon from '@mui/icons-material/SetMeal';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import HealingIcon from '@mui/icons-material/Healing';
import SoapIcon from '@mui/icons-material/Soap';
import Slider from '@mui/material/Slider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useState } from "react";




const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth:150
  }));

  const PriceRangeSlider = styled(Slider)({
    color: '#5f816f',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
    
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: '#5f816f',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
  });
  

function MainStore(){
    const [selectedCategories, setSelectedCategories] = useState([]);

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
            <Stack gap={0}>
               
                <IconButton onClick={() => handleCategorySelect('DairyEggs')} style={{boxShadow: selectedCategories.includes('DairyEggs') ? 'inset 0 0 5px #000' : 'none'}}><Item><IcecreamIcon/>Dairy & Eggs</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('Liquers')} style={{boxShadow: selectedCategories.includes('Liquers') ? 'inset 0 0 5px #000' : 'none'}}><Item><LiquorIcon/>Liquers</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('Frozen')} style={{boxShadow: selectedCategories.includes('Frozen') ? 'inset 0 0 5px #000' : 'none'}}><Item><SetMealIcon/>Frozen</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('FreshlyBaked')} style={{boxShadow: selectedCategories.includes('FreshlyBaked') ? 'inset 0 0 5px #000' : 'none'}}><Item><BakeryDiningIcon/>Freshly Baked</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('MeatFish')} style={{boxShadow: selectedCategories.includes('MeatFish') ? 'inset 0 0 5px #000' : 'none'}}><Item><KebabDiningIcon/>Meat & Fish</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('HealthBeauty')} style={{boxShadow: selectedCategories.includes('HealthBeauty') ? 'inset 0 0 5px #000' : 'none'}}><Item><HealingIcon/>Health & Beauty</Item></IconButton>
                <IconButton onClick={() => handleCategorySelect('Cleaning')} style={{boxShadow: selectedCategories.includes('Cleaning') ? 'inset 0 0 5px #000' : 'none'}}><Item><SoapIcon/>Cleaning</Item></IconButton>
               
                
            </Stack>
            
            <div className="products-wrapper">
                <Stepper activeStep={0} alternativeLabel>
                    {steps.map((label) => (
                    <Step  key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
                <div className="items-wrapper">
                  <Row className="g-5">
                    {items.filter(item => {
                      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);
                      return categoryMatch;
                    })
                    .map((item)=>(
                      <Col key={item.id} className="col"><ProductCard {...item} /></Col>
                    ))}
                  </Row>
                </div>
            </div>
        </Container>

    )
}
export default MainStore
import "../styles/MainStore.css"
import ProductCard from "./ProductCard";
import {Container, Row, Col} from "react-bootstrap";
import {Stack, Paper,IconButton} from "@mui/material"
import items from "../data/items.json";
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
    const steps = [
        'Add your groceries',
        'Fill aditional information',
        'Find the the best market!',
      ];

    return(
        <Container className="mainstore">
            <Stack gap={0}>
               
                <IconButton><Item><IcecreamIcon/>Dairy & Eggs</Item></IconButton>
                <IconButton><Item><LiquorIcon/>Liquers</Item></IconButton>
                <IconButton><Item><SetMealIcon/>Frozen</Item></IconButton>
                <IconButton><Item><BakeryDiningIcon/>Freshly Baked</Item></IconButton>
                <IconButton><Item><KebabDiningIcon/>Meat & Fish</Item></IconButton>
                <IconButton><Item><HealingIcon/>Health & Beaty</Item></IconButton>
                <IconButton><Item><SoapIcon/>Cleaning</Item></IconButton>
                <Item>
                    Price Range:<hr/>
                    <PriceRangeSlider
                        valueLabelDisplay="auto"
                        aria-label="pretto slider"
                        defaultValue={20}
                    />

                </Item>
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
                  <Row md={3} xs={1} lg={4} className="g-5">
                      {items.map((item)=>(
                        <Col key={item.id}><ProductCard {...item} /></Col>
                    ))}
                  </Row>
                </div>
                
            </div>
        </Container>

    )
}
export default MainStore
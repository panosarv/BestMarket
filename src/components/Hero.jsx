import "../styles/Hero.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styled from "@emotion/styled";



function Hero(){
    return(
        <div className="hero">
            <img src="/bm-hr-icon.29c1c3ff.png" alt="vm-image" />
            <div className="card-wrapper">
                <Card sx={{  maxWidth:220 , minWidth:220, minHeight:235}}>
                    <CardContent>
                        <Typography variant="h5" component="div">Find your groceries</Typography>
                        <hr/>
                        <Typography variant="body3" color="text.secondary">Add all the items you want to buy in your cart</Typography>
                    </CardContent>
                </Card>
                <Card sx={{  maxWidth:220 , minWidth:220, minHeight:235}}>
                    <CardContent>
                        <Typography variant="h5" component="div">Add your information</Typography>
                        <hr/>
                        <Typography variant="body3" color="text.secondary">Add aditional information like your locations and means of transport</Typography>
                    </CardContent>
                </Card>
                <Card sx={{  maxWidth:220 , minWidth:220, minHeight:235}}>
                    <CardContent>
                        <Typography variant="h5" component="div">Find the ideal super-market</Typography>
                        <hr/>
                        <Typography variant="body3" color="text.secondary">Find the ideal supermarket, suggested from our AI or browse through the additional</Typography>
                    </CardContent>
                </Card>
        </div>
    
        </div>
    )
}

export default Hero
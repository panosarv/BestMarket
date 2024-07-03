import "../styles/MainStore.css";
import CategoryCard from "./CategoryCard";
import { Container } from "react-bootstrap";
import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button, Grid, Stack, Skeleton, Box, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from "react";

function MainStore() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetch('https://bestmarket-server.onrender.com/api/mainstore')
            .then(response => response.json())
            .then(data => {
                console.log('data', data);
                setItems(data);
                setIsLoading(false);
            });
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

    const handleResetFilters = () => {
        setSelectedCategories([]);
    };

    return (
        <Container className="mainstore">
            <Box className="breadcrumb">
                <Typography variant="h6" component="div" className="breadcrumb-text"></Typography>
                <IconButton onClick={() => setDrawerOpen(true)} className="search-icon">
                    <SearchIcon fontSize="large" />
                    <Typography variant="button" className="filter-text">Filter</Typography>
                </IconButton>
            </Box>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250, position: 'relative', height: '100%' }} role="presentation">
                    <Button
                        variant="contained"
                        onClick={handleResetFilters}
                        sx={{ position: 'sticky', top: 0, right: 0, margin: '10px', zIndex: 1 }}
                    >
                        Reset
                    </Button>
                    <List sx={{ marginTop: '50px', overflowY: 'auto', height: 'calc(100% - 50px)' }}>
                        {items.map((category, index) => (
                            <ListItem key={index} button onClick={() => handleCategorySelect(category.name)}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedCategories.includes(category.name)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText primary={category.name} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            
            <div className="products-wrapper">
                {isLoading && (
                    <div className="items-wrapper">
                        <Stack spacing={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="rounded" style={{ width: '70vw', height: '25vh', borderRadius: '3em' }} />
                            <Skeleton variant="rounded" style={{ width: '70vw', height: '25vh', marginTop: '2em', borderRadius: '3em' }} />
                        </Stack>
                    </div>
                )}
                {!isLoading && (
                    <div className="items-wrapper">
                        <Grid container spacing={2} justifyContent="center">
                            {items.filter(item => {
                                const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.name);
                                return categoryMatch;
                            }).map((item) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={item.categoryid} className="product-grid-item">
                                    <CategoryCard {...item} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default MainStore;

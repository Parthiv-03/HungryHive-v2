import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import axios from 'axios'; 
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import IconButton from '@mui/material/IconButton';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Drawer from '@mui/material/Drawer';
import FilterListIcon from '@mui/icons-material/FilterList';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';


// Fetch food image from external API
const fetchFoodImage = async (foodType) => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodType}`);
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      return data.meals[0].strMealThumb;
    }
    return 'https://via.placeholder.com/150';
  } catch (error) {
    console.error('Error fetching food image:', error);
    return 'https://via.placeholder.com/150';
  }
};

const MenuPage = () => {
  const user = useSelector((state) => state.user.user);
  const isloggedin = useSelector((state) => state.user.isLoggedin);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


  const [foodData, setFoodData] = useState([
    { type: 'Pizza', imageUrl: '' },
    { type: 'Burger', imageUrl: '' },
    { type: 'Pasta', imageUrl: '' },
    { type: 'Salad', imageUrl: '' },
    { type: 'Sushi', imageUrl: '' },
    { type: 'Noodles', imageUrl: '' },
    { type: 'Soup', imageUrl: '' },
    { type: 'Steak', imageUrl: '' },
    { type: 'Sandwich', imageUrl: '' },
    { type: 'Tacos', imageUrl: '' },
    { type: 'Curry', imageUrl: '' },
    { type: 'Biryani', imageUrl: '' },
    { type: 'Lasagna', imageUrl: '' },
  ]);

  const [startIndex, setStartIndex] = useState(0);
  const [selectedFood, setSelectedFood] = useState('');
  const [storeData, setStoreData] = useState([]);
  const [filteredStoreData, setFilteredStoreData] = useState([]);
  const [storeQuantities, setStoreQuantities] = useState({});
  const visibleItems = 9;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Toggle filter drawer
  const toggleFilterDrawer = (open) => () => {
    setFilterDrawerOpen(open);
  };

  useEffect(() => {
    const fetchImages = async () => {
      const updatedFoodData = await Promise.all(
        foodData.map(async (food) => {
          const imageUrl = await fetchFoodImage(food.type);
          return { ...food, imageUrl };
        })
      );
      setFoodData(updatedFoodData);
    };
    fetchImages();
  }, []);

  // Left carousel navigation
  const handleLeftClick = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 3, 0));
  };

  // Right carousel navigation
  const handleRightClick = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 3, foodData.length - visibleItems));
  };

  // Fetch stores that sell the selected food type
  const handleFoodClick = async (foodType) => {
    setSelectedFood(foodType);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/store/getStore/${foodType}`); 
      setStoreData(response.data.stores);
      setFilteredStoreData(response.data.stores);
      
      // Calculate max price for the slider
      if (response.data.stores.length > 0) {
        const allPrices = response.data.stores.flatMap(store => 
          store.menu
            .filter(item => item.item_category === foodType)
            .map(item => item.item_price)
        );
        const maxItemPrice = Math.max(...allPrices);
        const roundedMax = maxItemPrice <= 1000 
          ? Math.ceil(maxItemPrice / 100) * 100
          : Math.ceil(maxItemPrice / 1000) * 1000;
        setMaxPrice(roundedMax);
        setPriceRange([0, roundedMax]);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  // Handle search input changes
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyFilters(value, isPriceFilterActive ? priceRange : null);
  };

  // Handle price range changes
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Toggle price filter
  const handleTogglePriceFilter = (event) => {
    setIsPriceFilterActive(event.target.checked);
  };

  // Apply filters
  const applyFilters = (search = searchTerm, priceRangeToApply = isPriceFilterActive ? priceRange : null) => {
    let filtered = [...storeData];
    
    // Apply search filter
    if (search && search.trim() !== '') {
      filtered = filtered.filter(store => 
        store.store_name.toLowerCase().includes(search.toLowerCase()) ||
        store.store_city.toLowerCase().includes(search.toLowerCase()) ||
        store.store_state.toLowerCase().includes(search.toLowerCase()) ||
        store.menu.some(item => 
          item.item_name.toLowerCase().includes(search.toLowerCase()) ||
          item.item_description.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    
    // Apply price filter
    if (priceRangeToApply) {
      filtered = filtered.map(store => ({
        ...store,
        menu: store.menu.filter(item => 
          item.item_category === selectedFood && 
          item.item_price >= priceRangeToApply[0] && 
          item.item_price <= priceRangeToApply[1]
        )
      })).filter(store => store.menu.length > 0);
    }
    
    setFilteredStoreData(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setIsPriceFilterActive(false);
    setFilteredStoreData(storeData);
  };

  // Format price for display
  const formatPrice = (price) => {
    if (price >= 1000) {
      return `₹${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
    }
    return `₹${price}`;
  };

  // Custom price marks for the slider
  const priceMarks = [
    { value: 0, label: '₹0' },
    { value: maxPrice / 4, label: formatPrice(maxPrice / 4) },
    { value: maxPrice / 2, label: formatPrice(maxPrice / 2) },
    { value: (maxPrice * 3) / 4, label: formatPrice((maxPrice * 3) / 4) },
    { value: maxPrice, label: formatPrice(maxPrice) },
  ];

  // Increment item quantity in the cart
  const handleIncrement = async (store, item) => {
    if(!isloggedin){
      alert('You have to sign in first !!');
      return;
    }
    const newQuantity = (storeQuantities[store.store_name]?.[item.item_name] || 0) + 1;
  
    try {
      let cartResponse = await axios.get(`${apiBaseUrl}/api/cart/${user._id}`);
      let cart = cartResponse.data.carts[0];
  
      if (cart && cart.items.length > 0) {
        const existingStoreId = cart.items[0].store.toString();
        if (existingStoreId !== store._id.toString()) {
          alert('You can only order from one store at a time.');
          return;
        }
      }
  
      setStoreQuantities((prevQuantities) => ({
        ...prevQuantities,
        [store.store_name]: {
          ...prevQuantities[store.store_name],
          [item.item_name]: newQuantity,
        },
      }));
  
      if (!cart) {
        const newCart = {
          userid: user._id,
          items: [{
            store: store._id,
            item_name: item.item_name,
            item_quantity: newQuantity,
            item_price: item.item_price,
            item_category: selectedFood,
          }],
          total_amount: item.item_price * newQuantity,
        };
  
        await axios.post(`${apiBaseUrl}/api/cart/add`, newCart);
      } else {
        let itemExists = false;
  
        const updatedItems = cart.items.map((cartItem) => {
          if (cartItem.item_name === item.item_name) {
            itemExists = true;
            return {
              ...cartItem,
              item_quantity: newQuantity,
            };
          }
          return cartItem;
        });
  
        if (!itemExists) {
          updatedItems.push({
            store: store._id,
            item_name: item.item_name,
            item_quantity: newQuantity,
            item_price: item.item_price,
            item_category: selectedFood,
          });
        }
  
        const updatedTotalAmount = updatedItems.reduce(
          (total, cartItem) => total + cartItem.item_quantity * cartItem.item_price,
          0
        );
  
        await axios.put(`${apiBaseUrl}/api/cart/update/${cart._id}`, {
          items: updatedItems,
          totalAmount: updatedTotalAmount,
        });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  // Decrement item quantity in the cart
  const handleDecrement = async (store, item) => {
    if(!isloggedin){
      alert('You have to sign in first !!');
      return;
    }
    const currentQuantity = storeQuantities[store.store_name]?.[item.item_name] || 0;
  
    if (currentQuantity <= 0) {
      return;
    }
  
    const newQuantity = currentQuantity - 1;
  
    try {
      let cartResponse = await axios.get(`${apiBaseUrl}/api/cart/${user._id}`);
      let cart = cartResponse.data.carts[0];
  
      if (!cart) {
        return;
      }
  
      const itemIndex = cart.items.findIndex(cartItem => cartItem.item_name === item.item_name);
  
      if (itemIndex !== -1) {
        if (newQuantity > 0) {
          cart.items[itemIndex].item_quantity = newQuantity;
  
          const updatedTotalAmount = cart.items.reduce(
            (total, cartItem) => total + cartItem.item_quantity * cartItem.item_price,
            0
          );
  
          await axios.put(`${apiBaseUrl}/api/cart/update/${cart._id}`, {
            items: cart.items,
            totalAmount: updatedTotalAmount,
          });
        } else {
          const updatedItems = cart.items.filter((_, index) => index !== itemIndex);
  
          if (updatedItems.length === 0) {
            await axios.delete(`${apiBaseUrl}/api/cart/delete/${cart._id}`);
          } else {
            const updatedTotalAmount = updatedItems.reduce(
              (total, cartItem) => total + cartItem.item_quantity * cartItem.item_price,
              0
            );
  
            await axios.put(`${apiBaseUrl}/api/cart/update/${cart._id}`, {
              items: updatedItems,
              totalAmount: updatedTotalAmount,
            });
          }
        }
  
        setStoreQuantities((prevQuantities) => ({
          ...prevQuantities,
          [store.store_name]: {
            ...prevQuantities[store.store_name],
            [item.item_name]: newQuantity,
          },
        }));
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  return (
    <Box
      sx={{
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
        <IconButton 
          onClick={handleLeftClick}
          disabled={startIndex === 0}
          sx={{ml: 'auto' }}
        >
          <NavigateBeforeOutlinedIcon sx={{ fontSize: '2rem' }}/>
        </IconButton>
        <IconButton 
          onClick={handleRightClick}
          disabled={startIndex >= foodData.length - visibleItems}
          sx={{mr: '2.5rem' }}
        >
          <NavigateNextOutlinedIcon sx={{ fontSize: '2rem' }}/>
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: 0,
          width: '100%',
          justifyContent: 'center',
          transition: 'transform 2s ease-in-out',
        }}
      >
        {foodData.slice(startIndex, startIndex + visibleItems).map((food) => (
          <Box
            key={food.type}
            onClick={() => handleFoodClick(food.type)}
            sx={{
              textAlign: 'center',
              cursor: 'pointer',
              flex: '1 0 9%',
              transition: 'transform 2s ease-in-out',
            }}
          >
            <Avatar
              src={food.imageUrl}
              alt={food.type}
              sx={{ width: 100, height: 100, mb: 1, mx: 'auto' }}
            />
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {food.type}
            </Typography>
          </Box>
        ))}
      </Box>

      {selectedFood && filteredStoreData.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center', width: '80%' }}>
          <Typography variant="h5" mb={2}>
            Stores selling {selectedFood}
          </Typography>

          {/* Search and Filter Bar */}
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mb: 2, gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Search ${selectedFood} stores...`}
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ maxWidth: '600px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={toggleFilterDrawer(true)}
              sx={{ height: '56px' }}
            >
              Filters
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
            {filteredStoreData.length} {filteredStoreData.length === 1 ? 'store' : 'stores'} found
          </Typography>

          <Grid container spacing={3}>
            {filteredStoreData.map((store, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={store.store_image || 'https://via.placeholder.com/300'} 
                    alt={store.store_name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {store.store_name}
                    </Typography>
                    {store.menu && store.menu.filter(item => item.item_category === selectedFood).map(item => (
                      <Box key={item.item_name} sx={{ mt: 1 }}>
                        <Typography variant="body2">{item.item_name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 , mt:1}}>
                        ₹ {item.item_price}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 , mb:0.5}}>
                          <Button
                            variant="outlined"
                            onClick={() => handleDecrement(store, item)}
                            disabled={storeQuantities[store.store_name] === 0}
                          >
                            -
                          </Button>
                          <Typography sx={{ mx: 2 }}>
                            {storeQuantities[store.store_name]?.[item.item_name] || 0}
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => handleIncrement(store, item)}
                          >
                            +
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={toggleFilterDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 350 },
            p: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={toggleFilterDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Price Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2 }}>
            Price Range
          </Typography>
          
          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel 
              control={
                <Switch 
                  checked={isPriceFilterActive} 
                  onChange={handleTogglePriceFilter} 
                  color="primary"
                />
              } 
              label="Filter by price" 
            />
          </FormGroup>
          
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={maxPrice}
            marks={priceMarks}
            valueLabelFormat={formatPrice}
            disabled={!isPriceFilterActive}
            sx={{ 
              color: isPriceFilterActive ? 'primary.main' : 'grey.400',
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
              },
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color={isPriceFilterActive ? "text.primary" : "text.secondary"}>
              Current range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={resetFilters}
            fullWidth
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              applyFilters();
              setFilterDrawerOpen(false);
            }}
            fullWidth
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MenuPage;




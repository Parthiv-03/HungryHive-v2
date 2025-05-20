import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';

function HomePage() {

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const user = useSelector((state) => state.user.user);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [storeQuantities, setStoreQuantities] = useState({});
  const isloggedin = useSelector((state) => state.user.isLoggedin);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Toggle filter drawer
  const toggleFilterDrawer = (open) => () => {
    setFilterDrawerOpen(open);
  };

  // Increment item quantity in the cart
  const handleIncrement = async (item) => {
    if(!isloggedin){
      alert('You have to sign in first !!');
      return;
    }

    const newQuantity = (storeQuantities[item.store_name]?.[item.item_name] || 0) + 1;
    
    try {
      let cartResponse = await axios.get(`${apiBaseUrl}/api/cart/${user._id}`);
      let cart = cartResponse.data.carts[0];
  
      if (cart && cart.items.length > 0) {
        const existingStoreId = cart.items[0].store.toString();
        if (existingStoreId !== item.store_id.toString()) {
          alert('You can only order from one store at a time.');
          return;
        }
      }
  
      setStoreQuantities((prevQuantities) => ({
        ...prevQuantities,
        [item.store_name]: {
          ...prevQuantities[item.store_name],
          [item.item_name]: newQuantity,
        },
      }));
  
      if (!cart) {
        const newCart = {
          userid: user._id,
          items: [{
            store: item.store_id,
            item_name: item.item_name,
            item_quantity: newQuantity,
            item_price: item.item_price,
            item_category: item.item_category,
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
            store:  item.store_id,
            item_name: item.item_name,
            item_quantity: newQuantity,
            item_price: item.item_price,
            item_category: item.item_category,
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
  const handleDecrement = async (item) => {
    if(!isloggedin){
      alert('You have to sign in first !!');
      return;
    }

    const currentQuantity = storeQuantities[item.store_name]?.[item.item_name] || 0;
    
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
          [item.store_name]: {
            ...prevQuantities[item.store_name],
            [item.item_name]: newQuantity,
          },
        }));
      }
    } catch (error) {
      console.error('Error updating cart:', error);
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

    const applyFilters = () => {
    let filtered = [...items];
    
    if (searchTerm && searchTerm.trim() !== '') {
      filtered = filtered.filter(item => 
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.store_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.store_state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (isPriceFilterActive) {
      filtered = filtered.filter(item => 
        item.item_price >= priceRange[0] && item.item_price <= priceRange[1]
      );
    }
    
    setFilteredItems(filtered);
    setFilterDrawerOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setIsPriceFilterActive(false);
    setFilteredItems(items);
    setFilterDrawerOpen(false);
  };

  // Format price for display
  const formatPrice = (price) => {
    if (price >= 1000) {
      return `₹${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
    }
    return `₹${price}`;
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const city = user?.address?.city ? `/${user.address.city}` : '';
        const response = await axios.get(`${apiBaseUrl}/api/store/getNearbyStore/city${city}`);
        
        if(!response.data.message){
          const fetchedItems = response.data;
          setItems(fetchedItems);
          setFilteredItems(fetchedItems);
          
          if (fetchedItems.length > 0) {
            const maxItemPrice = Math.max(...fetchedItems.map(item => item.item_price));
            const roundedMax = maxItemPrice <= 1000 
              ? Math.ceil(maxItemPrice / 100) * 100
              : Math.ceil(maxItemPrice / 1000) * 1000;
            setMaxPrice(roundedMax);
            setPriceRange([0, roundedMax]);
          }
        } else {
          setItems([]);
          setFilteredItems([]);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [user?.address?.city]);

  // Custom price marks for the slider
  const priceMarks = [
    { value: 0, label: '₹0' },
    { value: maxPrice / 4, label: formatPrice(maxPrice / 4) },
    { value: maxPrice / 2, label: formatPrice(maxPrice / 2) },
    { value: (maxPrice * 3) / 4, label: formatPrice((maxPrice * 3) / 4) },
    { value: maxPrice, label: formatPrice(maxPrice) },
  ];

  return (
    <>
      <p style={{ textAlign:'center', fontWeight: 500, fontSize: '2rem'}}>
        Top restaurants Food {user?.address?.city ? 'in ' + user.address.city : ''}
      </p>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 2 }}>
        {/* Search Bar and Filter Button */}
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mb: 2, gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for food or restaurants..."
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

        {/* Results count display */}
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found
        </Typography>
      </Box>

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
            onClick={applyFilters}
            fullWidth
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* Items Grid */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          marginLeft: 3,
          marginTop: 3,
          justifyContent: 'start',
          width: '100%',
        }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <Card
              key={index}
              sx={{
                width: '30%',
                maxWidth: 300,
                flex: '1 1 calc(33.333% - 20px)',
                margin: '15px'
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.item_photo || 'https://via.placeholder.com/300'}
                alt={item.store_name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {item.item_name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 30,
                    overflow: 'hidden',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {item.item_description}
                </Typography>
                <Typography variant="body2" color="text.primary" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                  {formatPrice(item.item_price)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 30,
                  overflow: 'hidden',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}>
                  {item.store_name} - {item.store_city}, {item.store_state}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleDecrement(item)}
                    disabled={!storeQuantities[item.store_name]?.[item.item_name]}
                  >
                    -
                  </Button>
                  <Typography variant="body1" sx={{ mx: 2 }}>
                    {storeQuantities[item.store_name]?.[item.item_name] || 0}
                  </Typography>
                  <Button 
                    variant="outlined"
                    onClick={() => handleIncrement(item)}
                  >
                    +
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ ml: 3, width: '100%', textAlign: 'center' }}>
            {searchTerm || isPriceFilterActive ? 'No items match your filters. Try adjusting your search or price range.' : 'No items available.'}
          </Typography>
        )}
      </Box>
    </>
  );
}

export default HomePage;
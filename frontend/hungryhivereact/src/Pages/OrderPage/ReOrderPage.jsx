import React, { useState,useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';

function ReorderPage() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const user = useSelector((state) => state.user.user);
  const isloggedin = useSelector((state) => state.user.isLoggedin);

  const [orderitem, setorderitem] = useState([]);
  useEffect(() => {
    const fetchOrder = async () => {
      if(!isloggedin){
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${user._id}`);
        console.log(response.data);
        setorderitem(response.data.orders);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, []);

  useEffect(() => {
    console.log(orderitem); // Log fetched cart details for debugging
  }, [orderitem]);


  const handleToggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId); // Toggle between showing and hiding
  };

  const handleReorder = async (order) => {
    try {
      order.userid = order.user;
      order.storeid = order.store;
      const response = await axios.post('http://localhost:5000/api/orders/add', order);
      if (response.status === 201) {
        alert(`Reordering items from ${order.store}`);
        console.log('Order placed successfully', response.data.order);
        setorderitem((previtem) => [...previtem, response.data.order]);
      }
    } catch (error) {
      console.error('Error placing the order:', error);
    }
  };

  return (
  <>
  {isloggedin ? (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Your Past Orders
      </Typography>

      {orderitem.map((order,index) => (
        <Card
          key={index}
          sx={{ width: '90%', maxWidth: 800, borderRadius: 4, boxShadow: 3, mb: 3 }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="h6">
                  Order #Id{index+1}: {order._id}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => handleToggleDetails(order._id)}
                  sx={{
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  {expandedOrder === order._id ? 'Hide Details' : 'Details'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleReorder(order)}
                  sx={{
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  Reorder
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Collapse in={expandedOrder === order._id} timeout="auto" unmountOnExit>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                
                {/* Left Side: Order Items and Prices */}
                <Box sx={{ flex: 1, pr: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ordered on: {order.orderedAt}
                  </Typography>

                  <List>
                    {order.orders.map((item, index) => (
                      <ListItem key={index} sx={{ padding: '4px 8px' }}>
                        <ListItemText
                          primary={`${item.item_name} (x${item.item_quantity})`}
                          secondary={`₹ ${item.item_price}`}
                          primaryTypographyProps={{ fontSize: '0.9rem' }}
                          secondaryTypographyProps={{ fontSize: '0.8rem' }}
                        />
                      </ListItem>
                    ))}
                    <ListItem sx={{ padding: '4px 8px' }}>
                      <ListItemText
                        primary="Total"
                        secondary={`₹ ${order.total_amount}`}
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  </List>
                </Box>
                {/* Right Side: Enhanced Delivery Details */}
                <Box sx={{ flex: 1, pl: 2, borderLeft: '1px solid #e0e0e0', padding: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Delivery Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      {order.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      Time taken: 20 min
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      Delivery Person: Rahul Sharma
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  ) : (
    <p style={{color:'red', justifyContent:'center',display: 'flex',fontSize:'1.5rem'}}>You have to Signin First !!</p>
  )}
</>
  );
}

export default ReorderPage;
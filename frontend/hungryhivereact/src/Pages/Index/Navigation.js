import React from 'react';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import Chip from '@mui/material/Chip';

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: React.createElement(DashboardIcon),  // Converted JSX to React.createElement
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Menu & Stores',
  },
  {
    segment: 'menus',
    title: 'Menu',
    icon: React.createElement(RestaurantMenuOutlinedIcon),  // React.createElement
  },
  // {
  //   segment: 'store',
  //   title: 'Store',
  //   icon: React.createElement(StoreOutlinedIcon),  // React.createElement
  // },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Orders & Cart',
  },
  {
    segment: 'Orders',
    title: 'Orders',
    icon: React.createElement(BarChartIcon),  // React.createElement
    children: [
      {
        segment: 'Live-Orders',
        title: 'Live-Orders',
        icon: React.createElement(InventoryRoundedIcon),  // React.createElement
      },
      {
        segment: 'Re-order',
        title: 'Re-Order',
        icon: React.createElement(HistoryRoundedIcon),  // React.createElement
      },
    ],
  },
  {
    segment: 'Cart',
    title: 'Cart',
    icon: React.createElement(ShoppingCartIcon),  // React.createElement
    action: React.createElement(Chip, { label: 7, color: 'primary', size: 'small' }),  // React.createElement for Chip
  },
  {
    kind: 'divider',
  },
];

// Export the navigation array
export default NAVIGATION;

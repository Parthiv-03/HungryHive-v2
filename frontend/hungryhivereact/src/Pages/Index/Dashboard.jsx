import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import NAVIGATION from './Navigation';
import Theme from './Theme';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Login from '../Authentication/Login';
import HomePage from '../HomePage/HomePage';
import ProfilePage from '../ProfilePage/ProfilePage';
import LiveOrdersPage from '../OrderPage/LiveOrdersPage';
import CartPage from '../CartPage/CartPage';
import MenuPage from '../MenuPage/MenuPage';
import ReorderPage from '../OrderPage/ReOrderPage';

function Dashboard() {
  const isloggedin = useSelector((state) => state.user.isLoggedin); // Track Redux state directly
  const [modalOpen, setModalOpen] = useState(false);
  const [pathname, setPathname] = useState('/dashboard');
  const [navigation,setNavigation] = useState(NAVIGATION);

  // Function to open modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Component mapping
  const componentMapping = {
    '/dashboard': <HomePage />,
    '/menus': <MenuPage />,
    '/Cart': <CartPage/>,
    // '/store': <StorePage />,
    '/Orders/Live-Orders': <LiveOrdersPage />,
    '/Orders/Re-order': <ReorderPage />,
    '/profile': <ProfilePage/>,
  };

  // Get the component to render based on pathname
  const CurrentPage = componentMapping[pathname] || <HomePage />; // Fallback to DashboardPage

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        handleOpenModal();
      },
      signOut: () => {
      },
    };
  }, []);

 
  useEffect(() => {
    const profileNavItem = {
      segment: 'profile',
      title: 'Profile',
      icon: React.createElement(PersonOutlineOutlinedIcon),  // Direct JSX
    };
  
    if (isloggedin) {
      // Check if the profile item is not already in the NAVIGATION array
      if (!navigation.some(item => item.segment === 'profile')) {
        const updatedNavigation = [...navigation, profileNavItem]; // Create a new array
        setNavigation(updatedNavigation);  // Call a setter to update navigation
      }
    } else {
      if (navigation.some(item => item.segment === 'profile')) {
        const updatedNavigation = navigation.filter(item => item.segment !== 'profile'); // Create a new array
        setNavigation(updatedNavigation);  // Call a setter to update navigation
      }
    }
  }, [isloggedin]);


  return (
    isloggedin ? (<AppProvider
      navigation={navigation}
      router={router}
      theme={Theme}
      branding={{
        title: 'HungryHive',
      }}
    >
      <DashboardLayout>
        {CurrentPage}
        <Login isOpen={modalOpen} onClose={handleCloseModal}/>  
        
        {/* setisloggedin={setisloggedin} */}

      </DashboardLayout>
    </AppProvider>) : (<AppProvider
      authentication={authentication}
      navigation={navigation}
      router={router}
      theme={Theme}
      branding={{
        title: 'HungryHive',
      }}
    >
      <DashboardLayout>
        {CurrentPage}
        <Login isOpen={modalOpen} onClose={handleCloseModal}/>

        {/* setisloggedin={setisloggedin} */}

      </DashboardLayout>
    </AppProvider>)

  );
}


export default Dashboard;
# HungryHive - Food Ordering System

HungryHive is a full-stack food ordering system with separate frontend and backend layers, built using the MERN stack. It offers users the convenience of browsing nearby restaurants, placing orders, and managing Cart/Menu. MongoDB Atlas is used for data storage, and authentication options include OTP-based email verification and Google sign-in.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Pages](#pages)
  - [Sign-in Page](#sign-in-page)
  - [Home Page](#home-page)
  - [Menu Page](#menu-page)
  - [Cart Page](#cart-page)
  - [Order Page](#order-page)
  - [Reorder Page](#reorder-page)
  - [Profile Page](#profile-page)

---

## Features
- **Email OTP and Google authentication**
- **Nearby food recommendations based on user address**
- **Add items to cart from Home or Menu page**
- **Update cart items and address before payment**
- **Order management, cancellation, and reordering options**
- **User profile updates**

---

## Technologies Used
- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Google Auth and custom OTP-based email verification

---

## Getting Started
### Prerequisites
- Node.js
- MongoDB Atlas account

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Divyang029/HungryHive.git
    ```
2. Install frontend and backend dependencies:
    ```bash
    cd backend
    npm install

    cd ..
    cd frontend/hungryhivereact
    npm install
    ```
3. Set up your environment variables:
   - Configure MongoDB connection in the backend
   - Add credentials for Mongodb url+port  and email OTP service in backend `.env`

4. Run the application:
    ```bash
    # Start backend
    cd backend
    nodemon index.js

    # Start frontend
    cd ..
    cd frontend/hungryhivereact
    npm run dev
    ```

---

## Pages

### Sign-in Page
- **Features**: 
  - Email OTP authentication
  - Google sign-in for instant access

![{817CA228-F38D-484F-81B5-F97DE4D69A62}](https://github.com/user-attachments/assets/f90bf316-70b0-488b-bd8b-6c110ca52c3e)

![{E90F3128-C3F9-4393-B4E2-42B5626FE417}](https://github.com/user-attachments/assets/3fc9b702-8caf-48a3-9010-48e5a5df1e9a)

### Home Page
- **Features**: 
  - Displays recommended food items based on user's location.
  - If no address is provided, shows popular nearby options.

![{8B4F9318-E15B-413F-84FF-481091760DEE}](https://github.com/user-attachments/assets/2a7021fb-0ce8-4ed5-86b2-eac5da1e0747)

### Menu Page
- **Features**: 
  - Displays a list of available food items.
  - Clicking on any item shows stores that sell the selected food.
  - Users can add items to the cart from this page.

![{99A61F08-4879-47A5-994A-90DC6D373FE3}](https://github.com/user-attachments/assets/4d4212ec-7465-4868-836a-5a406232c4c8)

### Cart Page
- **Features**: 
  - Lists items in the user's cart along with store and address information.
  - Users can update address and proceed to payment.

![{9E1605A4-1A1D-43FA-A05F-BA434776F3C1}](https://github.com/user-attachments/assets/1e2a1535-f817-4c0a-adec-1526c10c8668)

### Order Page
- **Features**: 
  - Displays a list of past orders.
  - Each order includes hardcoded salesperson information, details, and a cancellation option.

![{9531C53B-EF77-40CD-88B7-0229D6E6D992}](https://github.com/user-attachments/assets/7d81f94a-20eb-47df-80ef-43a4b670f969)

![{17608597-0466-49C6-BB5C-AD60DCECB91C}](https://github.com/user-attachments/assets/d5115bc7-873c-4bea-92fb-39fe57f0f1da)

### Reorder Page
- **Features**: 
  - Allows users to reorder items from their order history.

![{2FFA3CBE-0FFF-48BE-A71B-BF272D5C5463}](https://github.com/user-attachments/assets/054c9e6b-79af-4489-8c70-72f3a3469186)

### Profile Page
- **Features**: 
  - Allows users to update their profile information, including name, address, and contact details.
- **Code**: Renders profile form, updates MongoDB user data on submission.

![{2C23DC82-2626-4D91-8273-C7D35D0F6FAE}](https://github.com/user-attachments/assets/6a478fda-5c5c-4b70-bf49-e0c4aba1e772)

---

## Contributing
Feel free to submit issues or pull requests to help improve this project!

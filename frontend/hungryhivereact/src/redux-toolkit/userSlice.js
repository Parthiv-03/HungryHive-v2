// import {createSlice} from '@reduxjs/toolkit';

// const userSlice = createSlice({
//      name: 'user',
//      initialState: {
//           isLoggedin: false,
//           userid: "",
//      },
//      reducers: {
//           setlogin: (state, action) => {
//                state.isLoggedin = true;
//                state.userid = action.payload;
//           },
//           setlogout: (state,action) => {
//                state.isLoggedin = false;
//                state.userid = "";
//           }
//      }
// });

// export const { setlogin, setlogout} = userSlice.actions;
// export default userSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
     name: 'user',
     initialState: {
          isLoggedin: false,
          user: {},
     },
     reducers: {
          setlogin: (state, action) => {
               state.isLoggedin = true;
               state.user = action.payload;
          },
          setlogout: (state,action) => {
               state.isLoggedin = false;
               state.user = {};
          },
          setuser: (state,action) => {
               state.user = action.payload;
          }
     }
});

export const { setlogin, setlogout, setuser} = userSlice.actions;
export default userSlice.reducer;
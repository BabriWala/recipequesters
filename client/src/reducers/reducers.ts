// @ts-nocheck
// reducers.ts
import { combineReducers } from "redux";
import {
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
} from "../actionTypes";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case REGISTER_USER_SUCCESS:
    case LOGIN_USER_SUCCESS:
      return action.payload;
    case LOGOUT_USER_SUCCESS:
      return null;
    default:
      return state;
  }
};

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer,
  // Add more reducers as needed
});

export default rootReducer;

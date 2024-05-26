import {
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
} from "../actionTypes";

export const registerUserSuccess = (user: any) => ({
  type: REGISTER_USER_SUCCESS,
  payload: user,
});

export const loginUserSuccess = (user: any) => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
});

export const logoutUserSuccess = () => ({
  type: LOGOUT_USER_SUCCESS,
});

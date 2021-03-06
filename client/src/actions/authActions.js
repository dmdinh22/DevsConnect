import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// register user
export const registerUser = (userData, history) => dispatch => {
	axios
		.post('/api/users/register', userData)
		.then(res => history.push('/login'))
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// login - get user token
export const loginUser = userData => dispatch => {
	axios
		.post('/api/users/login', userData)
		.then(res => {
			// save to localStorage
			const { token } = res.data;

			// set token to localStorage
			localStorage.setItem('jwtToken', token);

			// set token to auth header
			setAuthToken(token);

			// decode token to get user data
			const decoded = jwt_decode(token);

			// set current user
			dispatch(setCurrentUser(decoded));
		})
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// set logged in user
export const setCurrentUser = decoded => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	};
};

// user logout
export const logoutUser = () => dispatch => {
	// remove token from localStorage
	localStorage.removeItem('jwtToken');

	// remove auth header for future requests
	setAuthToken(false);

	// set current user to {} which will set isAuthenticated to false
	dispatch(setCurrentUser({}));
};

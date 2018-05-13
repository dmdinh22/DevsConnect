import axios from 'axios';
import {
	GET_PROFILE,
	GET_PROFILES,
	PROFILE_LOADING,
	CLEAR_CURRENT_PROFILE,
	GET_ERRORS,
	SET_CURRENT_USER
} from './types';

// get all profiles
export const getProfiles = () => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get('/api/profile/all')
		.then(result =>
			dispatch({
				type: GET_PROFILES,
				payload: result.data
			})
		)
		.catch(error =>
			dispatch({
				type: GET_PROFILES,
				payload: null
			})
		);
};

// get current profile
export const getCurrentProfile = () => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get('/api/profile')
		.then(result =>
			dispatch({
				type: GET_PROFILE,
				payload: result.data
			})
		)
		.catch(error =>
			dispatch({
				type: GET_PROFILE,
				payload: {}
			})
		);
};

// get profile by handle

export const getProfileByHandle = handle => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get(`/api/profile/handle/${handle}`)
		.then(result =>
			dispatch({
				type: GET_PROFILE,
				payload: result.data
			})
		)
		.catch(error =>
			dispatch({
				type: GET_PROFILE,
				payload: null
			})
		);
};

// create profile
export const createProfile = (profileData, history) => dispatch => {
	axios
		.post('/api/profile', profileData)
		.then(result => history.push('/dashboard'))
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// add exp
export const addExperience = (expData, history) => dispatch => {
	axios
		.post('/api/profile/experience', expData)
		.then(result => history.push('/dashboard'))
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// add edu
export const addEducation = (eduData, history) => dispatch => {
	axios
		.post('/api/profile/education', eduData)
		.then(result => history.push('/dashboard'))
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// delete exp
export const deleteExperience = id => dispatch => {
	axios
		.delete(`/api/profile/experience/${id}`)
		.then(result =>
			dispatch({
				type: GET_PROFILE,
				payload: result.data
			})
		)
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// delete edu
export const deleteEducation = id => dispatch => {
	axios
		.delete(`/api/profile/education/${id}`)
		.then(result =>
			dispatch({
				type: GET_PROFILE,
				payload: result.data
			})
		)
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// delete account and profile
export const deleteAccount = () => dispatch => {
	if (window.confirm('Are you sure? This can NOT be undone!')) {
		axios
			.delete('/api/profile')
			.then(result =>
				dispatch({
					type: SET_CURRENT_USER,
					payload: {}
				})
			)
			.catch(error =>
				dispatch({
					type: GET_ERRORS,
					payload: error.response.data
				})
			);
	}
};

// profile loading
export const setProfileLoading = () => {
	return {
		type: PROFILE_LOADING
	};
};

// clear profile
export const clearCurrentProfile = () => {
	return {
		type: CLEAR_CURRENT_PROFILE
	};
};

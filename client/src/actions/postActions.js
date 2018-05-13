import axios from 'axios';

import {
	ADD_POST,
	GET_ERRORS,
	CLEAR_ERRORS,
	GET_POSTS,
	GET_POST,
	POST_LOADING,
	DELETE_POST
} from './types';

// add post
export const addPost = postData => dispatch => {
	dispatch(clearErrors());
	axios
		.post('/api/posts', postData)
		.then(result =>
			dispatch({
				type: ADD_POST,
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

// get posts
export const getPosts = () => dispatch => {
	dispatch(setPostLoading());
	axios
		.get('/api/posts')
		.then(result =>
			dispatch({
				type: GET_POSTS,
				payload: result.data
			})
		)
		.catch(error =>
			dispatch({
				type: GET_POSTS,
				payload: null
			})
		);
};

// get single post
export const getPost = id => dispatch => {
	dispatch(setPostLoading());
	axios
		.get(`/api/posts/${id}`)
		.then(result =>
			dispatch({
				type: GET_POST,
				payload: result.data
			})
		)
		.catch(error =>
			dispatch({
				type: GET_POST,
				payload: null
			})
		);
};

// delete a post
export const deletePost = id => dispatch => {
	axios
		.delete(`/api/posts/${id}`)
		.then(result =>
			dispatch({
				type: DELETE_POST,
				payload: id
			})
		)
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// add like to post
export const addLike = id => dispatch => {
	axios
		.post(`/api/posts/like/${id}`)
		.then(result => dispatch(getPosts()))
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// dislike
export const removeLike = id => dispatch => {
	axios
		.post(`/api/posts/unlike/${id}`)
		.then(result => dispatch(getPosts()))
		.catch(error =>
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		);
};

// add comment to post
export const addComment = (postId, commentData) => dispatch => {
	dispatch(clearErrors());
	axios
		.post(`/api/posts/comment/${postId}`, commentData)
		.then(result =>
			dispatch({
				type: GET_POST,
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

// remove comment
export const deleteComment = (postId, commentId) => dispatch => {
	axios
		.delete(`/api/posts/comment/${postId}/${commentId}`)
		.then(result =>
			dispatch({
				type: GET_POST,
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

// set loading state
export const setPostLoading = () => {
	return {
		type: POST_LOADING
	};
};

// clear errors
export const clearErrors = () => {
	return {
		type: CLEAR_ERRORS
	};
};

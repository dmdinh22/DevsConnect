import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

// setup for chrome ext - prod only
let devTools =
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

// set to simple function in prod
if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
	devTools = a => a;
}

const store = createStore(
	rootReducer,
	initialState,
	compose(applyMiddleware(...middleware), devTools)
);

export default store;

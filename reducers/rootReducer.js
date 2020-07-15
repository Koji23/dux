import { userReducer } from './userReducer';
import { logger } from '../middleware/logger';

// Initialize the global state tree and subscribe any reducers that will be
// responsible for write logic over the state. 
const initialState = (props) => ({
  user: userReducer(),
  prevAction: null,
});

// Subscribe Reducers and define namespace for state slice.
// Don't forget to pass only the relevant state slice to each reducer
// This is essentially a manual version of redux combineReducers
const rootReducer = (state, action) => {
  const nextState = {
    user: userReducer(state.user, action),
    prevAction: action,
  };
  
  // Apply Middleware functions
  // Reducer middleware have access to both prev and next state (but not dispatch)
  // Like side-effects it technically happens after the reducers have created the nextState
  // but before the components are notified
  // 1. logger middleware
  if (process.env.NODE_ENV === 'development') {
    logger(state, action, nextState);
  }

  return nextState; // return the action too for use by side-effects
};

export {
  rootReducer,
  initialState,
};
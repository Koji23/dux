// import axios from 'axios';
import { localStorageGet } from 'utils/localStorage';

// TODO: get a keyMirror
export const GETTING_USER = 'GETTING_USER';
export const GOT_USER = 'GOT_USER';
export const SIGN_OUT = 'SIGN_OUT';

// api key at the very least must be persisted in LS or cookies for persistent auth
const initialState = localStorageGet('user') || null;

const userReducer = (state = initialState, action = {}) => {
  switch(action.type) {
    case GETTING_USER:
    case SIGN_OUT: {
      return null;
    }
    case GOT_USER: {
      return action.user;
    }
    default: return state;
  };
};

const dispatchers = {
  getUser: (dispatch, email, password) => {
    dispatch({ type: GETTING_USER, email, password });
  }, 
  signOut: (dispatch) => {
    localStorage.removeItem('user');
    dispatch({ type: SIGN_OUT, user: null });
  }
};

// TODO: front end authentication here is extremely rudimentary. But since there aren't any "pro" level
// features that we are trying to section off, this sign in wall is just so that we aren't openly exposing
// refinitiv data. Be sure to patch this up with something like cookie sessions or JWT tokens to ensure
// the keys are authentic
const selectors = {
  isLoggedIn: globalState => !!globalState.user && !!globalState.user.options,
  isAdmin: globalState => !!globalState.user && !!globalState.user.options && !!globalState.user.options.admin,
  userErrorMessage: globalState => globalState.user && globalState.user.error && globalState.user.message,
}

export {
  userReducer,
  dispatchers,
  selectors,
};

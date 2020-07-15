import React, { createContext, useReducer } from 'react';
import { rootReducer, initialState } from './reducers/rootReducer';
import { useRxSideEffect } from './middleware/epics/rootEpic';
import usePrevState from './usePrevState';

// Inject the state tree and its dispatch function into Context so that
// the useGlobalState hook can make it accessible to any functional components
// Additionally any useful middleware may be applied here as well

// Define the Context and Provider
const GlobalReducerContext = createContext(null); // TODO: should state be initialized here or in useReducer??? https://reactjs.org/docs/context.html#reactcreatecontext
GlobalReducerContext.displayName = 'GlobalReducerContext';

const GlobalReducerProvider = props => {
  // useReducer provides the state tree and action dispatcher we'll be using
  // and is recommended by React for handling complex state
  // https://reactjs.org/docs/hooks-reference.html#usereducer
  // The choice to go with a single state tree is divergent from the
  // article but favored in this case for simplified debugging, state rehydration,
  // and middleware
  // Note: props is passed as the initial argument to the init function so that initial values can potentially utilize it. 
  // However this is not often going to be leveraged because the global reducer initializes state much earlier than the components that use it
  const [globalState, dispatch] = useReducer(rootReducer, props, initialState);   
  const prevState = usePrevState(globalState);
  // NOTE: install rxjs via npm to utilize the useRxSideEffect hook
  // useRxSideEffect(prevState, globalState, dispatch)

  return (
    <GlobalReducerContext.Provider value={[globalState, dispatch]}>
      { props.children }
    </GlobalReducerContext.Provider>
  );
};

export {
  GlobalReducerContext,
  GlobalReducerProvider,
};
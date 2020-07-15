import React, { useContext } from 'react';
import { GlobalReducerContext } from './globalReducerContext';


// Tools for exposing the global state tree and the action dispatcher for functional components

// Hooks provide the easiest method of tapping into global state, at least 
// for functional components. However currently there aren't ways to
// bail out of running custom hook logic for performance optimization
// https://reactjs.org/docs/hooks-reference.html#bailing-out-of-a-dispatch
// It's implied that we shouldn't be too afraid of those updates as the React
// reconciler is capable of diffing the real changes to apply to the DOM. But
// as of now this hook will force components to update anytime the global
// state changes. Therefore use the withGlobalReducer HOC below for better performance.
// Leaving this here for reference in case hooks offer a bail out option in the future
// The HOC option is not better or worse in any way, it'd just be cool if we could use hooks here too

// function useGlobalReducer(mapStateToProps= gs => getSelection) {
//   const [ globalState, dispatch ] = useContext(GlobalReducerContext);
//   if (!globalState) {
//     throw new Error(`useGlobalReducer must be used within a GlobalStateProvider`)
//   }
//   return [ mapStateToProps(globalState), dispatch ];
// }

// As a safer and more perfomant way of interacting with global state (compared to useGlobalReducer),
// HOC's allow use to define a props barrier by rendering an inner
// component. This allows us to use memo for prop diffing and avoid
// accidentally updating the component when irrelevant parts of the
// global state are changed. This is the preferred method for now
// until react provides us with ways to bail out of hooks
// https://github.com/facebook/react/issues/14110
// Note: hooks can only be used in functional components. Since Higher Order Components aren't
// actually components themselves but rather functions that return a component, hooks will not
// work inside of them. Therefore we can't do something cleaner like `useContext(GlobalReducerContext);`
// this is why we have .Consumer here
function withGlobalReducer(WrappedComponent, mapStateToProps = () => ({})) {
  return (props) => {
    const PureWrappedComponent = React.memo(WrappedComponent)
    return (
      <GlobalReducerContext.Consumer>
        { (context) => {
          if (context === undefined) {
            throw new Error('GlobalReducerContext.Consumer must be used within a GlobalReducerProvider')
          }
          const [globalState, dispatch] = context;
          return (
            <PureWrappedComponent
              {...props}
              {...mapStateToProps(globalState)}
              dispatch={dispatch}
            />
          );
        }}
      </GlobalReducerContext.Consumer>
    );
  };
};

export {
  withGlobalReducer,
};

import { withGlobalReducer } from './withGlobalReducer';
import { GlobalReducerContext, GlobalReducerProvider } from './globalReducerContext';
import {
  dispatchers as userDispatchers,
  selectors as userSelectors,
} from './reducers/userReducer';

/*
1. GlobalReducerContext will allow any component beneath the Provider to access the
global reducer either via GlobalReducerContext.Provider or the useContext hook.
The global reducer always returns a new object in order to signal the state change.
This is still performant since it mostly just needs to copy memory addresses for all
sub-reducer slices expect for the ones that need to respond to a particular action.
GlobalReducerContext is also where sub-reducers can be added to the global reducer.
Steps for this are:
  - Add a default value for the state slice that this sub-reducer manages. Ideally
    sharing the same name as the reducer but without the postfix "Reducer"
  - rootReducer is just a function that collects all the sub-reducer outputs. So
    include the sub-reducer's output within the rootReducer's return value.
    Additionally middleware may be called within the rootReducer is desired.
  - export any sub-reducer dispatchers in this file for convenient importing

2. GlobalReducerProvider is the thing that must wrap a parent component such as App
so child components may access the global reducer.

3. withGlobalReducer is an HOC that injects props related to the global reducer. Namely
those would be the dispatch function which allows firing actions that the global reducer
can react to, as well as the result of a mapStateToProps function which allows
cherry-picking relevant data from the global state injecting them as props. The HOC also
turns the wrapped component into a pure component so that it will only update if the
relevant parts of the global state were updated.

4. Sub-Reducer specific collections of dispatchers are included here for convenience.
These are functions that must be provided the dispatch function as a first argument and
will use it to do some work (often but not necessarily asynchronous) and dispatch declarative
actions to the reducer. Dispatchers have the flexibility to dispatch multiple actions if desired.
Such as firing a loading, loadSuccess, loadFailure actions. However while useful, this isn't always necessary.
*/

export {
  GlobalReducerContext,
  GlobalReducerProvider,
  withGlobalReducer,
  userDispatchers,
  userSelectors,
};
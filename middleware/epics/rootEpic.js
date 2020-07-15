import { merge, Subject, from } from 'rxjs';
import { tap, map, mergeMap, switchMap, filter, catchError, mapTo, delay, } from 'rxjs/operators';
import { getUserEpic } from './userEpics';
import { useRef, useEffect } from 'react';


const ofType = (actionType) => filter(action => action.type === actionType);

const rootEpic = (action$, state$, dependencies) => merge(
  getUserEpic(action$),
).pipe(
  catchError((error, source) => {
    console.error(error);
    return source;
  })
); // Uncaught errors can bubble up to the root epic and cause the entire stream to terminate. As a consequence, epics registered in the middleware will no longer run in your application. To alleviate this issue, you can add a global error handler to the root epic that catches uncaught errors and resubscribes to the source stream.

const useRxSideEffect = (prevState, globalState, dispatch) => {
  // Apply Side-Effect functions
  // Side effects are similar to middleware but happen after the root reducer has completed
  // (and before the components have been informed). Unlike middleware they don't have access to
  // previous state (though that can be added with an extra useState inside the GlobalReducerProvider).
  // But importantly they have access to the dispatch. Side effects are ideal for network request
  // analytics and logging

  // Initialize the action and state subjects once store them for the lifetime of the hook
  const actionSubject$Ref = useRef(new Subject());
  const stateSubject$Ref = useRef(new Subject());

  const nextRef = useRef((action, state) => {
    const actionSubject$ = actionSubject$Ref.current;
    const stateSubject$ = stateSubject$Ref.current;
    if (!actionSubject$ || !stateSubject$) console.warn('Side Effect Error', actionSubject$, stateSubject$);
      actionSubject$.next(action);
      stateSubject$.next(state);
  })

  useEffect(() => {
    const actionSubject$ = actionSubject$Ref.current;
    const stateSubject$ = stateSubject$Ref.current;
    rootEpic(actionSubject$, stateSubject$).subscribe(dispatch);
  }, []);

  useEffect(() => {
    const next = nextRef.current;
    if (globalState.prevAction === undefined) {
      // initial value of prevAction should be null so just checking for undefined should suffice
      console.warn('prevAction is not initialized. useRxSideEffect is bailing out');
      return;
    }
    if (globalState.prevAction !== null && globalState.prevAction.type) {
      // push new data to the streams as long as it exists and is a proper action
      next(globalState.prevAction, globalState)
    }
  });
}

export {
  // observableEffect,
  ofType,
  useRxSideEffect,
};
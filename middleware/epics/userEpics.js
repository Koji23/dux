
import { map, mergeMap, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { ofType } from './rootEpic';
import { localStorageSet } from 'utils/localStorage';
import { GETTING_USER, GOT_USER } from '../../reducers/userReducer';

const getUserEpic = action$ => action$.pipe(
  ofType(GETTING_USER),
  // tap(a => console.log('hi', a)),
  mergeMap(({ email, password }) =>
    ajax.getJSON(`https://apitest.marketpsych.com/website/auth?email=${email}&password=${password}`).pipe(
      map(user => {
        if (!user.error) localStorageSet('user', user);
        return { type: GOT_USER, user };
      }),
    ),
  )
);

export {
  getUserEpic,
};
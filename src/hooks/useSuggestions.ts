import { useReducer, useCallback } from 'react';
import {
  CountryAction,
  CountryPromise,
  CountryState,
  CountryTypes,
} from '../types';

/**
 * Country suggestion reducer
 * @param state reducer state
 * @param action action to be dispatched
 * @returns New state after action dispatch
 */
function reducer(state: CountryState, action: CountryAction): CountryState {
  switch (action.type) {
    case CountryTypes.pending:
      return {
        ...state,
        status: CountryTypes.pending,
        error: null,
      };
    case CountryTypes.resolved:
      return {
        status: CountryTypes.resolved,
        suggestions: action.payload,
        error: null,
      };
    case CountryTypes.rejected:
      return {
        status: CountryTypes.rejected,
        suggestions: [],
        error: action.payload,
      };
    case CountryTypes.idle:
      return {
        ...state,
        status: CountryTypes.idle,
      };
    case CountryTypes.reset:
      return {
        status: CountryTypes.idle,
        suggestions: [],
      };
    default:
      return state;
  }
}

/**
 * useSuggestions Custom to handle the api state call within a reducer, and the api promise
 * @param param.status Initial status
 * @returns returns an object containing the custom promise, and the current state
 */
function useSuggestions({ status }: { status: string }) {
  const [state, dispatch] = useReducer(reducer, {
    status,
    suggestions: [],
  });

  const run = useCallback((promise: any) => {
    if (!promise) {
      return;
    }

    dispatch({ type: CountryTypes.pending });
    promise
      .then((data: CountryPromise[]) => {
        dispatch({
          type: CountryTypes.resolved,
          payload: data.map((item) => ({
            ccn3: item.ccn3,
            common: item.name.common,
            official: item.name.official,
            flag: item.flags.png,
          })),
        });
      })
      .catch((error: any) => {
        dispatch({ type: CountryTypes.rejected, payload: error });
      });
  }, []);

  return { run, state, dispatch };
}

export default useSuggestions;

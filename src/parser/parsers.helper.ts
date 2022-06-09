import type { Result, State } from ".";
import { ERR_RESULT, OK_RESULT, ResError, ResOk } from "./parser.model";

export function updateState<T = string, E = string>(
   state: State<T, E>, 
   index: number, 
   result: Result<T, E>): State<T, E> {
   
      return { ...state, index,  result }
};

export function updateResult<T = string, E = string>(
   state: State<T, E>, 
   result: ResOk<T>): State<T, E> {
      
      return { ...state, result };
}

export function updateError<T = string, E1 = string, E2 = E1>(state: State<T, E1>, error: ResError<E2>): State<T, E2> {
   return {  ...state, result: error};
}


export function mapOk<T, E1, E2>(state: State<T, E1>): State<T, E2> {
      
   if (state.result.resType === OK_RESULT) {
      return {...state, result: state.result}
   } else {
      throw new Error('Tried to map `Ok` type but instead got `Error`');
   }
}

export function mapErr<T1, T2, E>(state: State<T1, E>): State<T2, E> {
      
   if (state.result.resType === ERR_RESULT) {
      return {...state, result: state.result}
   } else {
      throw new Error('Tried to map `Ok` type but instead got `Error`');
   }
}
  

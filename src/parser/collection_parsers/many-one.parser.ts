import { ERR_RESULT, OK_RESULT, Parser, State } from "../models/parser.model";
import { Many } from "../models/result-type.model";
import { mapErr, newErr, ResOk } from "../models/result.model";

/**
 * Creates a parser that matches at least once
 * @typeparam R the type of value that will be matched
 * @param parser the parser to be matched
 * @returns returns the built up many parser
 */
export function manyOne<T = string, R = string>(parser: Parser<T, R>): Parser<T, R> {
   return new Parser<T, R>(
      (state: State<T>): State<R> => {
         if (state.result.resType === ERR_RESULT) 
            return mapErr<T,R, string>(state);
         
         let next = state;
         const results: R[] = [];
         const res: Many<R> = {
            resType: 'many',
            value: results
         };
         let done = false;
         
         while(!done) {
            const testState = parser.parserStateTransfromerFn(next);
            
            if (testState.result.resType === ERR_RESULT) {
               done = true;
            } else if (testState.result.result.resType === 'one') {
               results.push(testState.result.result.value);
               next = {...testState, result: null};
            } else if (testState.result.result.resType === 'many') {
               results.push(...testState.result.result.value);
            }
         }
      
         if (results.length === 0) {
            const err = newErr(`manyOne: Unable to match any input using parser @ index`);
            return {...state, result: err}
         }
      
         return {
            ...state, result: { resType: 'ok', result: res } 
         };
   });
}
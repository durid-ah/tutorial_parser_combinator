import { Parser } from "../models/parser.model";
import { Cardinal, Many } from "../models/result-cardinal.model";
import { mapErr, newErr, ResultType } from "../models/result.model";
import { State } from "../models/state.model";

/**
 * Creates a parser that matches at least once
 * @typeparam R the type of value that will be matched
 * @param parser the parser to be matched
 * @returns returns the built up many parser
 */
export function manyOne<R1, R2, T>(parser: Parser<R1, R2, T>) {
   return new Parser<R1, R2, T>(
      (state: State<R1, string, T>): State<R2, string, T> => {
         if (state.result.resType === ResultType.Error) 
            return mapErr<R1, R2, T, string>(state);
         
         let next = state;
         const results: R2[] = [];
         const res: Many<R2> = {
            resType: Cardinal.Many,
            value: results
         };
         let done = false;
         
         while(!done) {
            const testState = parser.parserStateTransfromerFn(next);
            
            if (testState.result.resType === ResultType.Error) {
               done = true;
            } else if (testState.result.result.resType === Cardinal.One) {
               results.push(testState.result.result.value);
               next = {...testState, result: null};
            } else if (testState.result.result.resType === Cardinal.Many) {
               results.push(...testState.result.result.value);
            }
         }
      
         if (results.length === 0) {
            const err = newErr(`manyOne: Unable to match any input using parser @ index`);
            return {...state, result: err}
         }
      
         return {
            ...state, result: { resType: ResultType.Ok, result: res } 
         };
   });
}
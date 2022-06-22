import { Parser } from "../models/parser.model";
import { Cardinal, Many } from "../models/result-cardinal.model";
import { mapErr, ResultType } from "../models/result.model";
import { State } from "../models/state.model";


/**
 * Create a parser that matches zero or more instances of the parser
 * @typeparam `T1` the type of value that will be matched
 * @typeparam `T2` the type of the target value
 * @param parser the parser that needs to matched 
 * @returns the many parser
 */
export function Many<R1, R2, T, E>(parser: Parser<R1, R2, T, E>) {
   return new Parser<R1, R2, T, E>(
      (state: State<R1, E, T>): State<R2, E, T> => {
         if (state.result.resType === ResultType.Error) 
            return mapErr<R1,R2, T, E>(state);
         
         const results: R2[] = [];
         
         let done = false;

         while(!done) {
            const testState = parser.parserStateTransfromerFn(state);
            
            if (testState.result.resType === ResultType.Error) {
               done = true;
            } else if (testState.result.result.resType === Cardinal.One) {
               results.push(testState.result.result.value);
            } else if (testState.result.result.resType === Cardinal.Many) {
               results.push(...testState.result.result.value);
            }

            state.index = testState.index;
         }

         const res: Many<R2> = {
            resType: Cardinal.Many, value: results
         };

         return {
            ...state, result: { resType: ResultType.Ok, result: res } 
         };
      }
   );
}
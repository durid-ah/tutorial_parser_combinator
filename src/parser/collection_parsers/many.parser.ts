import { ERR_RESULT, Parser, State } from "../models/parser.model";
import { Many } from "../models/result-type.model";
import { mapErr } from "../models/result.model";

/**
 * Create a parser that matches zero or more instances of the parser
 * @typeparam T the type of value that will be matched
 * @param parser the parser that needs to matched 
 * @returns the many parser
 */
export function many<T = string>(parser: Parser<T, T>): Parser<T, T> {
   return new Parser<T, T>(
      (state: State<T>): State<T> => {
         if (state.result.resType === ERR_RESULT) 
            return mapErr(state);
         
         const results: T[] = [];
         
         let done = false;

         while(!done) {
            const testState = parser.parserStateTransfromerFn(state);
            
            if (testState.result.resType === ERR_RESULT) {
               done = true;
            } else if (testState.result.result.resType === 'one') {
               results.push(testState.result.result.value);
            } else if (testState.result.result.resType === 'many') {
               results.push(...testState.result.result.value);
            }
         }

         const res: Many<T> = {
            resType: 'many', value: results
         };

         return {
            ...state, result: { resType: 'ok', result: res } 
         };
      }
   );
}
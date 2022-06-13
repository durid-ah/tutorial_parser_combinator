import { ERR_RESULT, Parser, State } from "../models/parser.model";
import { Cardinal, Many } from "../models/result-type.model";
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
            } else if (testState.result.result.resType === Cardinal.One) {
               results.push(testState.result.result.value);
            } else if (testState.result.result.resType === Cardinal.Many) {
               results.push(...testState.result.result.value);
            }
         }

         const res: Many<T> = {
            resType: Cardinal.Many, value: results
         };

         return {
            ...state, result: { resType: 'ok', result: res } 
         };
      }
   );
}
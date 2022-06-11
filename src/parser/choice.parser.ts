import { Parser, State } from ".";
import { ERR_RESULT, OK_RESULT } from "./models/parser.model";
import { mapErr, newErr } from "./models/result.model";


/**
 * Check to match the first one out of the list of parsers
 * @param parsers 
 * @returns 
 */
export function choice<T, R>(parsers: Parser<T, R>[]) {
   return new Parser<T, R>(
      (state: State<T>): State<R> => {
         if (state.result.resType === ERR_RESULT) 
            return mapErr<T,R, string>(state);

         for (let parser of parsers) {
            const next = parser.parserStateTransfromerFn(state);
            if (next.result.resType === OK_RESULT) return next;
         }

         const err = newErr(`choice: Unable to match with any parser at index ${state.index}`);
         return {...state, result: err};
      }
   );
}
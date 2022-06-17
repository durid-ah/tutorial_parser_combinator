import { Parser } from ".";
import { mapErr, newErr, ResultType } from "./models/result.model";
import { State } from "./models/state.model";


/**
 * Check to match the first one out of the list of parsers
 * @param parsers 
 * @returns 
 */
export function choice<R1, R2, T>(parsers: Parser<R1, R2, T>[]) {
   return new Parser<R1, R2, T>(
      (state: State<R1, string, T>): State<R2, string, T> => {
         if (state.result.resType === ResultType.Error) 
            return mapErr<R1, R2, T, string>(state);

         for (let parser of parsers) {
            const next = parser.parserStateTransfromerFn(state);
            if (next.result.resType === ResultType.Ok) return next;
         }

         const err = newErr(`choice: Unable to match with any parser at index ${state.index}`);
         return {...state, result: err};
      }
   );
}
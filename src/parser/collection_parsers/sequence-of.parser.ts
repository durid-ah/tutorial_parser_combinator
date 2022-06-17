import { Parser } from "../models/parser.model";
import { Cardinal, Many } from "../models/result-cardinal.model";
import { mapErr, newOk, ResultType } from "../models/result.model";
import { State } from "../models/state.model";

/**
 * Match the array of parsers that are passed in
 * @returns 
 */
export function sequenceOf<R1, R2, T, E>(parsers: Parser<R1, R2, T, E>[]): Parser<R1, R2, T, E> { 
   return new Parser<R1, R2, T, E>(
      (state: State<R1, E, T>): State<R2, E, T> => {
         if (state.result.resType === ResultType.Error) 
            return mapErr(state);
         const results: R2[] = [];
         let next: State<R1, E, T> = state;
         for (let parser of parsers) {
            const parserState = parser.parserStateTransfromerFn(next);
            
            if (parserState.result.resType === ResultType.Error)
               return {...parserState}
            else if (parserState.result.result.resType === Cardinal.One)
               results.push(parserState.result.result.value)
            else
               results.push(...parserState.result.result.value)
            
            next = {...parserState, result: newOk(null)};

         }

         const res: Many<R2> = {
            resType: Cardinal.Many, value: results
         };

         return { ...next, result: { resType: ResultType.Ok, result: res } };
      }
   );
}
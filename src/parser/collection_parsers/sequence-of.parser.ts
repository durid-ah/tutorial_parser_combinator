import { Parser, State } from "../models/parser.model";
import { Cardinal, Many } from "../models/result-cardinal.model";
import { mapErr, newOk, ResultType } from "../models/result.model";

/**
 * Match the array of parsers that are passed in
 * @returns 
 */
export function sequenceOf<T, R, E>(parsers: Parser<T, R, E>[]): Parser<T, R, E> { 
   return new Parser<T, R, E>(
      (state: State<T, E>): State<R, E> => {
         if (state.result.resType === ResultType.Error) 
            return mapErr(state);
         const results: R[] = [];
         let next: State<T, E> = state;
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

         const res: Many<R> = {
            resType: Cardinal.Many, value: results
         };

         return { ...next, result: { resType: ResultType.Ok, result: res } };
      }
   );
}
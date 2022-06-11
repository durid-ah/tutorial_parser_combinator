import { ERR_RESULT, Parser, State } from "../models/parser.model";
import { Many } from "../models/result-type.model";
import { mapErr } from "../models/result.model";

/**
 * Match the array of parsers that are passed in
 * @returns 
 */
export function sequenceOf<T, R, E>(parsers: Parser<T, R, E>[]): Parser<T, R, E> { 
   return new Parser<T, R, E>(
      (state: State<T, E>): State<R, E> => {
         if (state.result.resType === ERR_RESULT) 
            return mapErr(state);
         const results: R[] = [];
         let next: State<T, E> = state;
         for (let parser of parsers) {
            const parserState = parser.parserStateTransfromerFn(next);
            next = {...parserState, result: null };
            
            if (parserState.result.resType === ERR_RESULT)
               return {...parserState}
            else if (parserState.result.result.resType === 'one')
               results.push(parserState.result.result.value)
            else
               results.push(...parserState.result.result.value)
         }

         const res: Many<R> = {
            resType: 'many', value: results
         };

         return { ...next, result: { resType: 'ok', result: res } };
      }
   );
}
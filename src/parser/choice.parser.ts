import { Parser, Result, State } from "./parser.model";
import { updateError } from "./parsers.helper";

export function choice<R = Result>(parsers: Parser<R>[]) {
   return new Parser(
      (state: State<any>): State<R> => {
         if (state.isError) return state;

         for (let parser of parsers) {
            const next = parser.parserStateTransfromerFn(state);
            if (!next.isError) return next;
         }

         return updateError(
            state, 
            `choice: Unable to match with any parser at index ${state.index}`);
      }
   );
}
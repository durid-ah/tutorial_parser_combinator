import { Parser, State } from "./parser.model";
import { updateResult } from "./parsers.helper";

export const sequenceOf = (parsers: Parser[]) => 
   new Parser<string[]>(
      (state: State<any>): State<string[]> => {
         if (state.isError) return state; // TODO: this might be an issue
         const results: string[] = [];
         let next = state;
         for (let parser of parsers) {
            next = parser.parserStateTransfromerFn(next);
            results.push(next.result)
         }

         return updateResult(next, results);
      });

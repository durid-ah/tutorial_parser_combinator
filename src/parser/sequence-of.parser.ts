import { Parser, State, updateResult } from ".";

export function sequenceOf(parsers: Parser[]) { 
   return new Parser<string[]>(
      (state: State<any>): State<string[]> => {
         if (state.isError) return state; // TODO: this might be an issue
         const results: string[] = [];
         let next = state;
         for (let parser of parsers) {
            next = parser.parserStateTransfromerFn(next);
            results.push(next.result)
         }

         return updateResult(next, results);
      }
   );
}
import { ParserFn, ParserState } from "./parser.model";

export const str = (s: string) => (state: ParserState): ParserState => {
   const {index, target, isError} = state;
   if (isError) return state;

   if (target.slice(index).startsWith(s)) {
      return {
         ...state,
         result: s,
         index: index + s.length
      };
   }

   return {
      ...state,
      error: `Tried to match ${s}, but got "${target.slice(index, index + 10)}"`,
      isError: true
   };
}

export const sequenceOf = (parsers: ParserFn[]) => (state: ParserState): ParserState => {
   if (state.isError) return state;
   const results = [];
   let next = state;
   for (let parser of parsers) {
      next = parser(next);
      results.push(next.result)
   }

   return {
      ...next,
      result: results
   };
}
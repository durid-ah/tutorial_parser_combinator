
type ParserFn = (state: ParserState) => ParserState
type ParseResult = string | string[]; 
type ParserState = {
   target: string, 
   result: ParseResult,
   index: number,
   error?: string
   isError: boolean
}

const updateState = (
   state: ParserState, 
   index: number, 
   result: ParseResult
): ParserState => ({
   ...state,
   index,
   result
});

const updateError = (
   state: ParserState, 
   error: string
): ParserState => ({
   ...state,
   isError: true,
   error
});

const str = (s: string) => (state: ParserState): ParserState => {
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

const sequenceOf = (parsers: ParserFn[]) => (state: ParserState): ParserState => {
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

const run = (parser: ParserFn, target: string) => {
   const initial = {
      target,
      index: 0,
      result: null,
      isError: false
   }
   return parser(initial);
} 

const parser = str('hello there!');
console.log(run(parser, 'hello there!'));
console.log(run(parser, 'This is not correct'));

const parser_2 = sequenceOf([str('hello there!'), str('goodbye there!')]);
console.log(run(parser_2, 'hello there!goodbye there!'));
console.log(run(parser_2, 'hello there!goodbye there'));
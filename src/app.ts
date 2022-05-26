type ParserFn = (state: ParserState) => ParserState
type ParserState = {
   target: string,
   result: string,
   index: number
}

const str = (s: string) => (state: ParserState): ParserState => {
   const {index, target} = state;
   if (target.slice(index).startsWith(s)) {
      return {
         ...state,
         result: s,
         index: index + s.length
      };
   }

   throw new Error(`Tried to match ${s}, but got "${target.slice(index, index + 10)}"`);
}

const run = (parser: ParserFn, target: string) => {
   const initial = {
      target,
      index: 0,
      result: null
   }
   return parser(initial);
} 

const parser = str('hello there!');
console.log(run(parser, 'hello there!'));
console.log(run(parser, 'This is not correct'));
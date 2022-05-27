import { ParserFn, sequenceOf, str } from "./parser";


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
console.log(run(parser_2, ''));
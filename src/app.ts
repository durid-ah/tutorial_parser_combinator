import { between, choice, digits, letters, sequenceOf, str } from "./parser";

// const parser = str('hello there!');
// console.log(parser.run('hello there!'));
// console.log(parser.run('This is not correct'));

// const parser_2 = sequenceOf([str('hello there!'), str('goodbye there!')]);
// console.log(parser_2.run('hello there!goodbye there!'));
// console.log(parser_2.run('hello there!goodbye there'));
// console.log(parser_2.run(''));

// const parser_3 = parser.map(res => {
//    let resString = res as string;
//    return resString.toUpperCase();
// });
// console.log(parser_3.run('hello there!'));

// const parser_4 = parser_2
//    .mapError((_, idx) => `Expected a greeting @ index ${idx}`);
// console.log(parser_4.run(''));

// const parser_5 = letters;
// console.log(parser_5.run('1234'));
// console.log(parser_5.run('asde'));

const parser_6 = digits;
console.log(parser_6.run('1234'));
console.log(parser_6.run('asde'));

// const seq_parser = sequenceOf([digits, letters, digits])
// console.log(seq_parser.run('12123asdasfas12312'));

// const choice_parser = choice([digits, letters, digits])
// console.log(choice_parser.run('asdasfas12312'));

// const betweenBrackets = between(str('('), str(')'));
// const parser = betweenBrackets(letters);
// console.log(parser.run('(1)'));

type Res<T> = { type: string, value: T };

// "string:hello"
const stringParser = letters.map<Res<string>>(result => ({
   type: 'string',
   value: result
}));

// "number:42"
const numberParser = digits.map(result => ({
   type: 'number',
   value: Number(result)
}));

// "diceroll:2d8"
const diceroll = sequenceOf([digits, str('d'), digits])
   .map(([n, _, s]) => ({
   type: 'diceroll',
   value: [Number(n), Number(s)]
}));


const parser = sequenceOf([letters, str(':')])
   .map(res => res[0])
   .chain<any>(state => {
      const type: string =  (state.result as any).type;
      switch (type) {
         // case 'string':
         //    return stringParser;      
         case 'number':
            return numberParser;
         default:
            return diceroll;
      }
   });

sequenceOf([
   
])
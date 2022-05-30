import { letter, sequenceOf, str } from "./parser";



const parser = str('hello there!');
console.log(parser.run('hello there!'));
console.log(parser.run('This is not correct'));

const parser_2 = sequenceOf([str('hello there!'), str('goodbye there!')]);
console.log(parser_2.run('hello there!goodbye there!'));
console.log(parser_2.run('hello there!goodbye there'));
console.log(parser_2.run(''));

const parser_3 = parser.map(res => {
   let resString = res as string;
   return resString.toUpperCase();
});
console.log(parser_3.run('hello there!'));

const parser_4 = parser_2
   .mapError((_, idx) => `Expected a greeting @ index ${idx}`);
console.log(parser_4.run(''));

const parser_5 = letter;
console.log(parser_5.run('1234'));
console.log(parser_5.run('asde'));
import { Between, Digits, Letters, SequenceOf, SepBy, Str, Many } from "./parser";
import { Bit } from "./parser/bit_parsers/bit.parser";

// const parser = str('hello there!');
// console.log(parser.run('hello there!'));
// console.log(parser.run('This is not correct'));

// const parser_2 = sequenceOf([str('hello there!'), str('goodbye there!')]);
// console.log(parser_2.run('hello there!goodbye there!'));
// console.log('#######################################');
// console.log('PART TWO:');
// console.log('#######################################');
// console.log(parser_2.run('hello there!goodbye there'));
// console.log('#######################################');
// console.log('PART THREE:');
// console.log('#######################################');
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

// const parser_6 = digits;
// console.log(parser_6.run('1234'));
// console.log(parser_6.run('asde'));

// const seq_parser = sequenceOf([digits, letters, digits])
// console.log(seq_parser.run('12123asdasfas12312'));

// const choice_parser = choice([digits, letters, digits])
// console.log(choice_parser.run('asdasfas12312'));

// const betweenBrackets = between(str('('), str(')'));
// const parser = betweenBrackets(letters);
// console.log(parser.run('(1)'));

// type Res<T> = { type: string, value: T };

// "string:hello"
// const stringParser = letters.map<Res<string>>(result => ({
//    type: 'string',
//    value: result
// }));

// "number:42"
// const numberParser = digits.map<Res<Number>>(result => ({
//    type: 'number',
//    value: Number(result)
// }));

// "diceroll:2d8"
// const diceroll = sequenceOf([digits, str('d'), digits])
//    .map<Res<number[]>>(([n, _, s]) => ({
//    type: 'diceroll',
//    value: [Number(n), Number(s)]
// }));


// const parser = sequenceOf([letters, str(':')])
//    .map(res => res[0])
//    .chain<any>(type => {
//       console.log(type);
//       switch (type) {
//          case 'string':
//             return stringParser;      
//          case 'number':
//             return numberParser;
//          default:
//             return diceroll;
//       }
//    });

// console.log(parser.run('string:hello'));
// console.log(parser.run('number:42'));
// console.log(parser.run('number:s'));

// const betweenSquareBrackets = between(str('['), str(']'));
// const commaSeparated = sepBy(str(','));

// const value = lazy(() => choice([
//    digits, arrayParser
// ]));


// const arrayParser = betweenSquareBrackets(commaSeparated(digits));

// console.log(arrayParser.run('[1,2,3,4]'));

// console.log(arrayParser.run('[1,[2,4],5]'));

const data = (new Uint8Array([234,235])).buffer;
const dataView = new DataView(data);
const bitSeq = Many(Bit());

const res = bitSeq.run(dataView);

console.log(res.result);

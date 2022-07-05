import { evaluate } from "./evaluator";
import { Between, Choice, Digits, SequenceOf, Str, Lazy, Parser, Many } from "./parser";
import { Bit } from "./parser/bit_parsers/bit.parser";
import { RawString } from "./parser/bit_parsers/raw-string.parser";
import { newOne } from "./parser/models/result-cardinal.model";
import { newOk, ResultType } from "./parser/models/result.model";

export type LangRes = NumberRes | OperationRes | string;

export type Operation = {
   op: LangRes,
   a: LangRes,
   b: LangRes 
}

export type NumberRes = {
   type: 'number',
   value: number
}

export type OperationRes = {
   type: 'operation',
   value: Operation
}

const betweenBrackets = Between<LangRes, LangRes, LangRes, LangRes>(Str('('), Str(')'));
const numberParser = Digits()
   .map<LangRes>(
      res => newOk(newOne({ type: 'number', value: Number(res.result.value) }))
   );

const operatorParser = Choice([
   Str('+'),
   Str('-'),
   Str('*'),
   Str('/')
]);

const expr: Parser<LangRes, LangRes, LangRes, LangRes> = Lazy(
   () => Choice<LangRes, LangRes, LangRes>([
      numberParser as Parser<LangRes, LangRes, LangRes, string>,
      operationParser as Parser<LangRes, LangRes, LangRes, string>
   ])
);


const operationParser = betweenBrackets(
   SequenceOf([
      operatorParser,
      Str(' '),
      expr,
      Str(' '),
      expr,
   ])
).map<LangRes>(res => {
   const results = res.result.value as LangRes[];
   return newOk(
      newOne({
         type: 'operation',
         value: {
            op: results[0],
            a: results[2],
            b: results[4]
         }
      })
   )
});

const interpreter = (propgram: string) => {
   const resultState = expr.run(program);
   if (resultState.result.resType === ResultType.Error)
      throw new Error('Invalid Program');

   return evaluate(resultState.result.result.value as LangRes)
}

const program = '(+ (* 10 2) (- (/ 50 3) 2))';
const result = interpreter(program);
console.log(JSON.stringify(result, null, ' '))


// const stringParser = RawString('Hello world!');
// const stringAsCharcodes = 'Hello world'.split('').map(c => c.charCodeAt(0))
// const data = new DataView((new Uint8Array(stringAsCharcodes)).buffer);

// const res = stringParser.run(data);
// console.log(res);
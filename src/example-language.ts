import { evaluate } from "./evaluator";
import { between, choice, digits, sequenceOf, str, lazy, Parser, many } from "./parser";
import { bit } from "./parser/bit_parsers/bit.parser";
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

const betweenBrackets = between<LangRes, LangRes, LangRes, LangRes>(str('('), str(')'));
const numberParser = digits()
   .map<LangRes>(
      res => newOk(newOne({ type: 'number', value: Number(res.result.value) }))
   );

const operatorParser = choice([
   str('+'),
   str('-'),
   str('*'),
   str('/')
]);

const expr: Parser<LangRes, LangRes, LangRes, LangRes> = lazy(
   () => choice<LangRes, LangRes, LangRes>([
      numberParser as Parser<LangRes, LangRes, LangRes, string>,
      operationParser as Parser<LangRes, LangRes, LangRes, string>
   ])
);


const operationParser = betweenBrackets(
   sequenceOf([
      operatorParser,
      str(' '),
      expr,
      str(' '),
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


const data = (new Uint8Array([234,235])).buffer;
const dataView = new DataView(data);
const bitSeq = many(bit());

const res = bitSeq.run(dataView);

console.log(res.result);
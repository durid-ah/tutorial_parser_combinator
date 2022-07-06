import { evaluate } from "./evaluator";
import { Between, Choice, Digits, SequenceOf, Str, Lazy, Parser, Many } from "./parser";
import { Fail } from "./parser/fail.parser";
import { newOne } from "./parser/models/result-cardinal.model";
import { newOk, ResultType } from "./parser/models/result.model";
import { Succeed } from "./parser/models/succeed.parser";

export type LangRes = NumberRes | OperationRes | string;

export type Operation = {
   op: LangRes,
   vals: LangRes[]
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
   .mapOk<LangRes>(
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

const spacePrefixedExpr = SequenceOf([Str(' '), expr])
const atLeastTwo: Parser<LangRes, LangRes, LangRes, LangRes> = Many(spacePrefixedExpr).chain(res => {
   if (res.resType === ResultType.Error)
      return Fail(res.error)
   else if ((res.result.value as LangRes[]).length <= 1)
      return Fail('atLeastTwo: Operator takes at least two arguments')
   else
      return Succeed(res.result);
});

// Parse: (op <num> <num>)
const operationParser = betweenBrackets(
   SequenceOf([
      operatorParser,
      atLeastTwo
   ])
).mapOk<LangRes>(res => {
   const results = (res.result.value as LangRes[]).filter((_, idx) => idx % 2 === 0);

   return newOk(
      newOne({
         type: 'operation',
         value: {
            op: results[0],
            vals: results.slice(1)
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

const program = '(+ (* 10 2) (- (/ 50 3) 2) 1)';

const result = interpreter(program);
console.log(JSON.stringify(result, null, ' '))

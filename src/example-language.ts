import { evaluate } from "./evaluator";
import { between, choice, digits, sequenceOf, str } from "./parser";
import { lazy } from "./parser/lazy.parser";

export type LangRes = NumberRes | OperationRes;

export type Operation = {
   op: string,
   a: LangRes | string,
   b: LangRes | string
}

export type NumberRes = {
   type: 'number',
   value: number
}

export type OperationRes = {
   type: 'operation',
   value: Operation
}

const betweenBrackets = between(str('('), str(')'));

const numberParser = digits.map<LangRes>(
   res => ({
   type: 'number',
   value: Number(res)
   })
);

const operatorParser = choice([
   str('+'),
   str('-'),
   str('*'),
   str('/')
]);

const expr = lazy(() => choice<LangRes | string>([
   numberParser,
   operationParser
]));

const operationParser = betweenBrackets(
   sequenceOf([
      operatorParser,
      str(' '),
      expr,
      str(' '),
      expr,
   ])
).map<LangRes>(results => ({
   type: 'operation',
   value: {
      op: results[0],
      a: results[2],
      b: results[4]
   }
}));

const interpreter = (propgram: string) => {
   const result = expr.run(program);
   if (result.isError)
      throw new Error('Invalid Program');

   return evaluate(result.result)
}

const program = '(+ (* 10 2) (- (/ 50 3) 2))';
const result = interpreter(program);
console.log(JSON.stringify(result, null, ' '))
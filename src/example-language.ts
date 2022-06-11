import { evaluate } from "./evaluator";
import { between, choice, digits, sequenceOf, str, lazy, Parser, OK_RESULT, ERR_RESULT } from "./parser";
import { newOne } from "./parser/models/result-type.model";
import { newOk, ResOk } from "./parser/models/result.model";

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

const betweenBrackets = between<LangRes, LangRes, string>(str('('), str(')'));

const numberParser = digits<LangRes>()
   .map<LangRes>(
      res => newOk(newOne({ type: 'number', value: Number(res.result.value) }))
   );

const operatorParser = choice<LangRes, LangRes>([
   str('+'),
   str('-'),
   str('*'),
   str('/')
]);

const expr: Parser<LangRes, LangRes, string> = lazy(
   () => choice<LangRes, LangRes>([
      numberParser,
      operationParser
   ])
);


const operationParser = betweenBrackets(
   sequenceOf<LangRes,LangRes, string>([
      operatorParser,
      str(' '),
      expr,
      str(' '),
      expr,
   ])
).map<LangRes>(res => {
   console.log(res) // TODO: Remove
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

}
);

const interpreter = (propgram: string) => {
   const resultState = expr.run(program);
   console.log((resultState.result as ResOk<any>).result.value);
   // if (resultState.result.resType === ERR_RESULT)
      // throw new Error('Invalid Program');
// 
   // return evaluate(resultState.result.result.value as LangRes)
}

const program = '(+ (* 10 2) (- (/ 50 3) 2))';
const result = interpreter(program);
console.log(JSON.stringify(result, null, ' '))
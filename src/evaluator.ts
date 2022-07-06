import { LangRes, NumberRes, Operation, OperationRes } from "./example-language";


export const evaluate = (nodeRes: LangRes): number => {
   const node = nodeRes as NumberRes | OperationRes;
   if (node.type === 'number') {
      return node.value;
   }

   if (node.type === 'operation') {
      const value = node.value as Operation;
      
      if (value.op === '+') {
         return value.vals.reduce((prev, curr) => prev + evaluate(curr), 0);
      }

      if (value.op === '-') {
         return value.vals.reverse()
            .reduce((prev, curr) => evaluate(curr) - prev, 0)
      }

      if (value.op === '*') {
         return value.vals.reduce((prev, curr) => prev * evaluate(curr), 1);
      }

      if (value.op === '/') {
         return value.vals.reverse()
            .reduce((prev, curr) => evaluate(curr) / prev, 1);
      }
   }


}
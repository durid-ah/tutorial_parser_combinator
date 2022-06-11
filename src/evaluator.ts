import { LangRes, NumberRes, Operation, OperationRes } from "./example-language";


export const evaluate = (nodeRes: LangRes) => {
   const node = nodeRes as NumberRes | OperationRes;
   if (node.type === 'number') {
      return node.value;
   }

   if (node.type === 'operation') {
      const value = node.value as Operation;
      
      if (value.op === '+') {
         return evaluate(value.a as LangRes) 
            + evaluate(value.b as LangRes);
      }

      if (value.op === '-') {
         return evaluate(value.a as LangRes) 
            - evaluate(value.b as LangRes);
      }

      if (value.op === '*') {
         return evaluate(value.a as LangRes) 
            * evaluate(value.b as LangRes);
      }

      if (value.op === '/') {
         return evaluate(value.a as LangRes) 
            / evaluate(value.b as LangRes);
      }
   }


}
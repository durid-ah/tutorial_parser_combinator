import { LangRes, Operation } from "./example-language";


export const evaluate = (node: LangRes) => {
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
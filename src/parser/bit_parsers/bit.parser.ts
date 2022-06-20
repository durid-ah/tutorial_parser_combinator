import { Parser } from "../models/parser.model";
import { updateError, updateState } from "../models/parsers.helper";
import { Cardinal } from "../models/result-cardinal.model";
import { mapErr, newErr, Result, ResultType } from "../models/result.model";
import { State } from "../models/state.model";

export function bit<R>() {
   return new Parser<R,number,DataView,string>(
      (state: State<R, string,DataView>): State<number,string,DataView> => {
         if (state.result.resType === ResultType.Error)
            return mapErr(state);

         
         const byteOffset = Math.floor(state.index/ 8);

         if (byteOffset >= state.target.byteLength)
            return updateError(
               mapErr(state), newErr(`Bit: Unexpected end of input`));
         
         const byte = state.target.getUint8(byteOffset);
         const bitOffset = state.index % 8;
         const result = (byte & 1 << bitOffset) >> bitOffset;
         const res: Result<number, string> = {
            resType: ResultType.Ok, 
            result: { resType: Cardinal.One, value: result }
         };

         return {...state, result: res};          
      });
}
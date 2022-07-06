import { RawString } from "../../src/parser/bit_parsers/raw-string.parser";
import { ResOk, ResultType } from "../../src/parser/models/result.model";


describe('RawString Parser Tests', () => {

   it('Should successfully parse the expected string', () => {
      const stringParser = RawString('Hello world!');
      const stringAsCharcodes = 'Hello world!'.split('').map(c => c.charCodeAt(0))
      const data = new DataView((new Uint8Array(stringAsCharcodes)).buffer);

      const result = (stringParser.run(data).result as ResOk<number>).result.value;
      expect(result).toEqual([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33]);
   });

   it('Should fail if the strings don\'t match', () => {
      const stringParser = RawString('Hello world!');
      const stringAsCharcodes = 'Hello world'.split('').map(c => c.charCodeAt(0))
      const data = new DataView((new Uint8Array(stringAsCharcodes)).buffer);

      const result = stringParser.run(data);
      expect(result.result.resType).toEqual(ResultType.Error);
   });
});
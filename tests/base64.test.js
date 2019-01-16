import { encode64, decode64 } from '../src/rpc/utils/base64';

describe('base64', () => {
  describe('encode64', () => {
    it('should throw error', () => {
      expect(() => {
        encode64('A');
      }).toThrow(/This is not a number/);
    });

    it('should encode correctly', () => {
      let number = 0;
      let str = 'A';
      expect(encode64(number)).toEqual(str);

      number = 1115021247;
      str = 'BCdd$_';
      expect(encode64(number)).toEqual(str);
    });
  });

  describe('decode64', () => {
    it('should throw error', () => {
      expect(() => {
        decode64('!@#$%^&*');
      }).toThrow(/There were invalid base64 characters/);
    });

    it('should decode correctly', () => {
      let number = 0;
      let str = 'A';
      expect(decode64(str)).toEqual(number);

      number = 1115021247333;
      str = 'QOccgNl';
      expect(decode64(str)).toEqual(number);
    });
  });
});

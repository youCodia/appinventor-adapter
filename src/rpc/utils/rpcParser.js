import range from 'lodash/range';
import findKey from 'lodash/findKey';
import upperFirst from 'lodash/upperFirst';
import { Types } from '../configs';

export function getString(strArr, dataArr) {
  const v = parseInt(dataArr.pop(), 10);
  return (v <= 0 ? null : strArr[v - 1]);
}

export async function parseData(strData, json) {
  const str = getString(strData, json);
  switch (str) {
    case Types.array: {
      const numOfItems = parseInt(json.pop(), 10);
      if (numOfItems === 0) {
        return [];
      }
      const result = [];
      for (let n of range(numOfItems)) {  // eslint-disable-line
        result.push(await parseData(strData, json)); // eslint-disable-line no-await-in-loop
      }
      return result;
    }

    case Types.string: {
      return getString(strData, json);
    }

    default: {
      const key = findKey(Types, type => type === str);
      if (!key) {
        return str;
      }
      const importClass = upperFirst(key);
      const model = await import(`../models/${importClass}`);
      const Model = model.default;
      if (Model) {
        return new Model(strData, json);
      }
      return new model(strData, json);
    }
  }
}

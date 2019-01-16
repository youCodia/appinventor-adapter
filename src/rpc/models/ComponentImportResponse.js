import upperFirst from 'lodash/upperFirst';
import findKey from 'lodash/findKey';
import { decode64 } from '../utils/base64';
import { getString } from '../utils/rpcParser';
import { Types } from '../configs';
import { YoungAndroid } from './YoungAndroidProjectNode';

export default class ComponentImportResponse {
  constructor(strData, arr) {
    if (strData && arr) {
      this.message = getString(strData, arr); // "A" = null
      this.nodes = this.constructNodes(strData, arr); // encoded date
      this.projectId = decode64(arr.pop());
      this.status = decode64(arr.pop()); // encoded date
      this.types = decode64(arr.pop()); // "A" = null
    }
  }

  constructNodes = (strData, arr) => {
    const arrType = getString(strData, arr);
    if (arrType === Types.array) {
      let arrSize = parseInt(arr.pop(), 10);
      const children = [];
      while (arrSize > 0) {
        const type = getString(strData, arr);
        const ModelName = upperFirst(findKey(Types, t => t === type));
        const Model = YoungAndroid[ModelName];
        const newModel = new Model(this);
        newModel.children = this.constructNodes(strData, arr);
        newModel.fileId = getString(strData, arr);
        newModel.name = getString(strData, arr);
        arr.pop(); // dummy pop for parent value
        children.push(newModel);
        arrSize -= 1;
      }
      return children;
    }
    return [];
  }
}

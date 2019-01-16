import upperFirst from 'lodash/upperFirst';
import findKey from 'lodash/findKey';
import { Types } from '../configs';
import { decode64 } from '../utils/base64';
import { getString } from '../utils/rpcParser';
import ProjectNode from './ProjectNode';
import YoungAndroidYailNode from './YoungAndroidYailNode';
import YoungAndroidSourceNode from './YoungAndroidSourceNode';
import YoungAndroidSourceFolderNode from './YoungAndroidSourceFolderNode';
import YoungAndroidPackageNode from './YoungAndroidPackageNode';
import YoungAndroidFormNode from './YoungAndroidFormNode';
import YoungAndroidComponentsFolder from './YoungAndroidComponentsFolder';
import YoungAndroidComponentNode from './YoungAndroidComponentNode';
import YoungAndroidBlocksNode from './YoungAndroidBlocksNode';
import YoungAndroidAssetsFolder from './YoungAndroidAssetsFolder';
import YoungAndroidAssetNode from './YoungAndroidAssetNode';

export const YoungAndroid = {
  YoungAndroidAssetNode,
  YoungAndroidAssetsFolder,
  YoungAndroidBlocksNode,
  YoungAndroidComponentNode,
  YoungAndroidComponentsFolder,
  YoungAndroidFormNode,
  YoungAndroidPackageNode,
  YoungAndroidSourceFolderNode,
  YoungAndroidSourceNode,
  YoungAndroidYailNode,
};

export default class YoungAndroidProjectNode extends ProjectNode {
  constructor(strData, arr) {
    super(null);
    this.projectId = decode64(arr.pop()); // "A" = null
    this.type = getString(strData, arr);
    this.children = this.constructChildren(strData, arr);
    this.fileId = getString(strData, arr);
    this.name = getString(strData, arr);
  }

  constructChildren = (strData, arr) => {
    const arrType = getString(strData, arr);
    if (arrType === Types.array) {
      let arrSize = parseInt(arr.pop(), 10);
      const children = [];
      while (arrSize > 0) {
        const type = getString(strData, arr);
        const ModelName = upperFirst(findKey(Types, t => t === type));
        const Model = YoungAndroid[ModelName];
        const newModel = new Model(this);
        newModel.children = this.constructChildren(strData, arr);
        newModel.fileId = getString(strData, arr);
        newModel.name = getString(strData, arr);
        arr.pop(); // dummy pop for parent value
        children.push(newModel);
        arrSize -= 1;
      }
      return children;
    }
    return [];
  };
}

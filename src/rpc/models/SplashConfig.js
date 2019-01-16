import { getString } from '../utils/rpcParser';

export default class UserConfig {
  constructor(strData, arr) {
    if (strData && arr) {
      this.content = getString(strData, arr);
      this.height = parseInt(arr.pop(), 10);
      this.version = parseInt(arr.pop(), 10);
      this.width = parseInt(arr.pop(), 10);
    }
  }
}

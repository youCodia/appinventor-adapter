import { getString } from '../utils/rpcParser';

export default class UserConfig {
  constructor(strData, arr) {
    if (strData && arr) {
      this.email = getString(strData, arr);
      this.emailFrequency = parseInt(arr.pop(), 10);
      this.id = getString(strData, arr);
      this.isAdmin = parseInt(arr.pop(), 10) === 1;
      this.isReadOnly = parseInt(arr.pop(), 10) === 1;
      this.link = getString(strData, arr);
      this.name = getString(strData, arr);
      const v = arr.pop();
      this.password = (v === '0' ? null : strData[parseInt(v, 10) - 1]);
      this.sessionId = getString(strData, arr);
      this.tosAccepted = parseInt(arr.pop(), 10) === 1;
      this.type = parseInt(arr.pop(), 10);
    }
  }
}

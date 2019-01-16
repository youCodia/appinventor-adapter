import md5 from 'md5';
import { getString } from '../utils/rpcParser';

export default class ChecksumedLoadFile {
  constructor(strData, arr) {
    if (strData && arr) {
      this.checksum = getString(strData, arr);
      this.content = getString(strData, arr);
    }
  }

  getContent() {
    const bytes = this.content.split('').map(x => x.charCodeAt(0));
    const hexVal = md5(bytes);
    if (hexVal !== this.checksum) {
      throw new Error(`Checksum doesn't match: ${hexVal} ${this.checksum}`);
    }
    return this.content;
  }
}

import { decode64, encode64 } from '../utils/base64';
import { getString } from '../utils/rpcParser';

export default class UserProject {
  constructor(strData, arr) {
    if (strData && arr) {
      this.attributionId = decode64(arr.pop()); // "A" = null
      this.creationDate = decode64(arr.pop()); // encoded date
      this.galleryId = decode64(arr.pop()); // "A" = null
      this.modificationDate = decode64(arr.pop()); // encoded date
      this.projectId = decode64(arr.pop());
      this.projectName = getString(strData, arr);
      this.projectType = getString(strData, arr);
    }
  }

  getBase64Id = () => encode64(this.projectId);
}

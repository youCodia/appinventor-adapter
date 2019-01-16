import { getString } from '../utils/rpcParser';

export default class RpcResult {
  static SUCCESS = 0;

  constructor(strData, arr) {
    if (strData && arr) {
      this.error = getString(strData, arr);
      this.extra = getString(strData, arr);
      this.output = getString(strData, arr);
      this.result = arr.pop();
    }
  }

  succeeded = () => (this.result === RpcResult.SUCCESS);

  failed = () => (this.result !== RpcResult.SUCCESS);
}

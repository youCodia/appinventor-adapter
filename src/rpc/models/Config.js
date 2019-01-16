import User from './User';
import SplashConfig from './SplashConfig';
import { getString } from '../utils/rpcParser';

export default class UserConfig {
  constructor(strData, arr) {
    if (strData && arr) {
      this.defaultCloudDBserver = getString(strData, arr);
      this.extensionsUrl = getString(strData, arr);
      this.feedbackUrl = getString(strData, arr);
      this.firebaseURL = getString(strData, arr);
      this.forumsUrl = getString(strData, arr);
      this.getStartedUrl = getString(strData, arr);
      this.guideUrl = getString(strData, arr);
      this.libraryUrl = getString(strData, arr);
      this.logoUrl = getString(strData, arr);
      this.noop = parseInt(arr.pop(), 10);
      this.referenceComponentsUrl = getString(strData, arr);
      this.releaseNotesUrl = getString(strData, arr);
      this.rendezvousServer = getString(strData, arr);
      this.secondBuildServer = arr.pop();
      this.splashConfig = new SplashConfig(strData, arr);
      this.tosUrl = getString(strData, arr);
      this.troubleshootingUrl = getString(strData, arr);
      this.tutorialsUrl = getString(strData, arr);
      arr.pop();
      this.user = new User(strData, arr);
    }
  }
}

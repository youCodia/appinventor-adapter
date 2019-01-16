const RPC = {
  set updateHost(serverDomain) {
    this.HOST = `http://${serverDomain}`;
  },
  HOST: '', // #911 Changing from https to http for failling to dowload the app with the link generated in Build App
  VERSION: 7,
  FLAG: 0,
  PERMUTATION_ID: '7AE84014EED0488F78262D5749511FEF', // from request
  TYPE: {
    STRING: 'string',
    ARRAY: 'array',
    USER_PROJECT: 'userProject',
    USER_CONFIG: 'userConfig',
    SPLASH_CONFIG: 'splashConfig',
    USER: 'user',
  },
};

// Policy Name comes from /build/war/WEB-INF/deploy/ode/rpcPolicyManifest/manifest.txt
export const Services = {
  project: {
    base: '/ode',
    url: '/projects',
    policyName: '7F6F811841FB3811235257087F428B2E',
    serviceFile: 'com.google.appinventor.shared.rpc.project.ProjectService',
  },
  userinfo: {
    base: '/ode',
    url: '/userinfo',
    policyName: 'EC4DFDD74084038EAFEE6A4690210EBA',
    serviceFile: 'com.google.appinventor.shared.rpc.user.UserInfoService',
  },
  component: {
    base: '/ode',
    url: '/components',
    policyName: '8BFF2A4E0FB0DA76103F79F8597CCA7B',
    serviceFile: 'com.google.appinventor.shared.rpc.component.ComponentService',
  },
};

// ODE Policy Name comes from /build/war/ode/*.gwt.rpc
export const Types = {
  int: 'I',
  long: 'J',
  boolean: 'Z',
  string: 'java.lang.String/2004016611',
  list: 'java.util.List',
  map: 'java.util.TreeMap/1493889780',
  array: 'java.util.ArrayList/4159755760',
  userProject: 'com.google.appinventor.shared.rpc.project.UserProject/4051224674',
  config: 'com.google.appinventor.shared.rpc.user.Config/3292205648',
  splashConfig: 'com.google.appinventor.shared.rpc.user.SplashConfig/917897862',
  user: 'com.google.appinventor.shared.rpc.user.User/3130036066',
  youngAndroidAssetNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidAssetNode/3698939010',
  youngAndroidAssetsFolder: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidAssetsFolder/3524809606',
  youngAndroidBlocksNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidBlocksNode/1973959899',
  youngAndroidComponentsFolder: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidComponentsFolder/4058810426',
  youngAndroidComponentNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidComponentNode/327788452',
  youngAndroidFormNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidFormNode/3242031682',
  youngAndroidPackageNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidPackageNode/404162700',
  youngAndroidProjectNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidProjectNode/3999559536',
  youngAndroidSourceFolderNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidSourceFolderNode/1539202537',
  youngAndroidYailNode: 'com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidYailNode/3020652743',
  checksumedLoadFile: 'com.google.appinventor.shared.rpc.project.ChecksumedLoadFile/4017192298',
  newProjectParameters: 'com.google.appinventor.shared.rpc.project.youngandroid.NewYoungAndroidProjectParameters/3790764037',
  fileDescriptorWithContent: 'com.google.appinventor.shared.rpc.project.FileDescriptorWithContent/2971559239',
  rpcResult: 'com.google.appinventor.shared.rpc.RpcResult/2898401967',
  componentImportResponse: 'com.google.appinventor.shared.rpc.component.ComponentImportResponse/707947127',
};

export default RPC;

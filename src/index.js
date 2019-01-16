import ChecksumedLoadFile from './rpc/models/ChecksumedLoadFile';
import FileDescriptorWithContent from './rpc/models/FileDescriptorWithContent';
import NewProjectParameters from './rpc/models/NewProjectParameters';
import RpcResult from './rpc/models/RpcResult';
import UserProject from './rpc/models/UserProject';
import YoungAndroidAssetNode from './rpc/models/YoungAndroidAssetNode';
import YoungAndroidBlocksNode from './rpc/models/YoungAndroidBlocksNode';
import YoungAndroidComponentNode from './rpc/models/YoungAndroidComponentNode';
import YoungAndroidFormNode from './rpc/models/YoungAndroidFormNode';
import {
  uploadFile,
  uploadComponent,
  uploadProject,
  uploadUserFile,
  getDownloadAssetsUrl,
  getDownloadExtensionsUrl,
  downloadFile,
  downloadKeystore,
  downloadProjectOutput,
  downloadProject,
} from './rpc/modules/file';
import {
  getProjectInfos,
  retrieveTemplateData,
  loadProjectSettings,
  storeProjectSettings,
  getProject,
  load2,
  loadraw2,
  deleteFile,
  deleteFolder,
  save2,
  deleteProject,
  addFile,
  newProject,
  copyProject,
  save,
  build,
  getBuildResult,
  newProjectFromTemplate,
} from './rpc/modules/projects';
import { acceptTOS } from './rpc/modules/acceptTOS';
import { importComponentToProject } from './rpc/modules/components';
import UserInfo from './rpc/modules/userinfo';
import { login, loginOAuth, logout } from './rpc/modules/auth';
import RPC from './rpc/configs';
import { encode64 } from './rpc/utils/base64';
import componentTypeJson from './simple_components.json';

export default {
  acceptTOS,
  importComponentToProject,
  ChecksumedLoadFile,
  componentTypeJson,
  encode64,
  FileDescriptorWithContent,
  login,
  loginOAuth,
  logout,
  NewProjectParameters,
  RPC,
  RpcResult,
  uploadFile,
  uploadComponent,
  uploadProject,
  uploadUserFile,
  getDownloadAssetsUrl,
  getDownloadExtensionsUrl,
  downloadFile,
  downloadKeystore,
  downloadProjectOutput,
  downloadProject,
  getProjectInfos,
  retrieveTemplateData,
  loadProjectSettings,
  storeProjectSettings,
  getProject,
  load2,
  loadraw2,
  deleteFile,
  deleteFolder,
  save2,
  deleteProject,
  addFile,
  newProject,
  copyProject,
  save,
  build,
  getBuildResult,
  newProjectFromTemplate,
  UserProject,
  UserInfo,
  YoungAndroidAssetNode,
  YoungAndroidBlocksNode,
  YoungAndroidComponentNode,
  YoungAndroidFormNode,
};

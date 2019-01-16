import { fileUpload, fileDownload } from '../ai2';

let sessionTime = new Date().getTime();

/*
 * URIs for upload requests are structured as follows:
 *    /<baseurl>/upload/project/<projectname>}
 *    /<baseurl>/upload/file/<projectId>/<filePath>
 *    /<baseurl>/upload/userfile/<filePath>
 */
export const uploadFile = (projectId, filePath, file) => {
  const name = 'uploadFile';
  const url = `/ode/upload/file/${projectId}/${filePath}/${file.name}`;
  sessionTime = new Date().getTime();
  return fileUpload(url, name, file);
};

export const uploadComponent = (file) => {
  const name = 'uploadComponentArchive';
  const url = `/ode/upload/component/${file.name}`;
  return fileUpload(url, name, file);
};

export const uploadProject = (file) => {
  const name = 'uploadProjectArchive';
  const url = `/ode/upload/project/${file.name.substring(0, file.name.lastIndexOf('.'))}`;
  return fileUpload(url, name, file);
};

export const uploadUserFile = (file) => {
  const name = 'uploadUserFile';
  const url = '/ode/upload/userfile/android.keystore';
  return fileUpload(url, name, file);
};

export const getDownloadAssetsUrl = (projectId, fileId) => `/ode/download/file/${projectId}/assets/${fileId}?t=${sessionTime}`;
export const getDownloadExtensionsUrl = (projectId, packageName, iconName) => `/ode/download/file/${projectId}/assets/external_comps/${packageName}/${iconName}?t=${sessionTime}`;

export const getDownloadFileUrl = (projectId, fileId) => {
  const timeStamp = new Date().getTime();
  return `/ode/download/file/${projectId}/${fileId}?t=${timeStamp}`;
};

export const downloadFile = (projectId, fileId) => fileDownload(getDownloadFileUrl(projectId, fileId));

export const downloadKeystore = () => fileDownload('/ode/download/userfile/android.keystore');

export const downloadProjectOutput = (projectId, target) => {
  const url = `/ode/download/project-output/${projectId}/${target}`;
  return fileDownload(url);
};

export const downloadProject = (projectId) => {
  const url = `/ode/download/project-source/${projectId}`;
  return fileDownload(url);
};

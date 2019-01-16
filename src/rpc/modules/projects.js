import { rpc, syncRpc } from '../ai2';

/**
 * Returns a list of project infos.
 * @return list of project infos found by the back-end
 */
export const getProjectInfos = () => rpc('project', 'getProjectInfos');

/**
 * Reads the template data from a JSON File
 * @param pathToTemplatesDir pathname of the templates directory which may contain
 *  0 or more template instances, each of which consists of a JSON file describing
 *  the template, plus a zip file and image files.
 *
 * @return a {@link String} or the template data
 */
export const retrieveTemplateData = () => rpc('project', 'retrieveTemplateData', 'templates/');


/**
 * Returns a string with the project settings.
 * @param projectId  project ID
 *
 * @return  settings
 */
export const loadProjectSettings = projectId => rpc('project', 'loadProjectSettings', projectId);

/**
 * Stores a string with the project settings.
 * @param sessionId current session id
 * @param projectId  project ID
 * @param settings  project settings
 */
export const storeProjectSettings = (sessionId, projectId, settings) => rpc('project', 'storeProjectSettings', sessionId, projectId, settings);

/**
 * Returns the root node for the given project.
 * @param projectId  project ID as received by
 *                   {@link #getProjects()}
 *
 * @return  root node of project
 */
export const getProject = projectId => rpc('project', 'getProject', projectId);

/**
 * Loads the file information associated with a node in the project tree. The
 * actual return value depends on the file kind. Source (text) files should
 * typically return their contents. Image files will be more likely to return
 * the URL that the browser can find them at.
 *
 * This version returns a ChecksumedLoadFile which includes the file content
 * and a checksum (MD5) of the content to detect silent network corruption
 *
 * @param projectId  project ID
 * @param fileId  project node whose source should be loaded
 *
 * @return  checksummed file object
 */
export const load2 = (projectId, fileId) => rpc('project', 'load2', projectId, fileId);

/**
 * Loads the file information associated with a node in the project tree. The
 * actual return value is the raw file contents encoded as base64.
 *
 * @param projectId  project ID
 * @param fileId  project node whose source should be loaded
 *
 * @return  raw file content as base 64
 */
export const loadraw2 = (projectId, fileId) => rpc('project', 'loadraw2', projectId, fileId);

/**
 * Deletes a file in the given project.
 * @param sessionId current session id
 * @param projectId  project ID
 * @param fileId  ID of file to delete
 * @return modification date for project
 */
export const deleteFile = (sessionId, projectId, fileId) => rpc('project', 'deleteFile', sessionId, projectId, fileId);

/**
 * Deletes all files and folders that are contained inside the given directory. The given directory itself is deleted.
 * @param sessionId session id
 * @param projectId project ID
 * @param directory path of the directory
 * @return modification date for project
 */
export const deleteFolder = (sessionId, projectId, directory) => rpc('project', 'deleteFolder', sessionId, projectId, directory);

/**
 * Saves the content of the file associated with a node in the project tree.
 * This version can throw a BlocksTruncatedException if an attempt is made to
 * save a trivial blocks file.
 *
 * @param sessionId current session id
 * @param projectId  project ID
 * @param fileId  project node whose source should be saved
 * @param force TODO: what's that!?
 * @param content  content to be saved
 * @return modification date for project
 *
 * @see #load(long, String)
 */
export const save2 = (sessionId, projectId, fileId, force, content, isSync) => {
  if (isSync) {
    return syncRpc('project', 'save2', sessionId, projectId, fileId, force, content);
  }
  return rpc('project', 'save2', sessionId, projectId, fileId, force, content);
};

/**
 * Deletes a project.
 *
 * @param userId the user id
 * @param projectId  project ID as received by
 */
export const deleteProject = projectId => rpc('project', 'deleteProject', projectId);

/**
 * Adds a file to the given project.
 *
 * @param projectId  project ID
 * @param fileId  ID of file to delete
 * @return modification date for project
 */
export const addFile = (projectId, fileId) => rpc('project', 'addFile', projectId, fileId);

/**
 * Creates a new project.
 * @param projectType type of new project
 * @param projectName name of new project
 * @param params optional parameters (project type dependent)
 *
 * @return a {@link UserProject} for new project
 */
export const newProject = (projectType, projectName, params) => rpc('project', 'newProject', projectType, projectName, params);

/**
 * Copies a project with a new name.
 *
 * @param userId the user id
 * @param oldProjectId  old project ID
 * @param newName new project name
 */
export const copyProject = (oldProjectId, newName) => rpc('project', 'copyProject', oldProjectId, newName);

/**
 * Saves the contents of multiple files.
 *
 * @param sessionId session id
 * @param filesAndContent  list containing file descriptors and their
 *                         associated content
 * @return modification date for last modified project of list
 */
export const save = (sessionId, filesAndContent) => rpc('project', 'save', sessionId, filesAndContent);

/**
 * Invokes a build command for the project on the back-end.
 *
 * @param projectId  project ID
 * @param nonce used to access the built project -- random string
 * @param target  build target (optional, implementation dependent)
 * @param secondBuildserver whether to use the second buildserver
 *
 * @return  results of invoking the build command
 */
export const build = (projectId, nonce, target, secondBuildServer) => rpc('project', 'build', projectId, nonce, target, secondBuildServer);
/**
 * Gets the result of a build command for the project from the back-end.
 *
 * @param projectId  project ID
 * @param target  build target (optional, implementation dependent)
 *
 * @return  results of build. The following values may be in RpcResult.result:
 *            0: Build is done and was successful
 *            1: Build is done and was unsuccessful
 *           -1: Build is not yet done.
 */
export const getBuildResult = (projectId, target) => rpc('project', 'getBuildResult', projectId, target);

/**
 * Creates a new project from a zip file that is stored on the server.
 * @param projectName name of new project
 * @param pathToZip path to the zip files
 *
 * @return a {@link UserProject} for new project
 */
export const newProjectFromTemplate = (projectName, pathToZip) => rpc('project', 'newProjectFromTemplate', projectName, pathToZip);

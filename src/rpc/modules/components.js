import { rpc } from '../ai2';

/**
 * Import the component to the project in the server and
 * return a list of ProjectNode that can be added to the client
 *
 * @param fileOrUrl the url of the component file or filename of temp file
 * @param projectId id of the project to which the component will be added
 * @param folderPath folder to which the component will be stored
 * @return a list of ProjectNode created from the component
 */
export const importComponentToProject = (fileOrUrl, projectId, folderPath) => rpc('component', 'importComponentToProject', fileOrUrl, projectId, folderPath);

// /**
//  * Rename the short name of an imported component
//  *
//  * @param fullyQualifiedName the fully qualified name of the component
//  * @param newName new short name
//  * @param projectId id of the project where the component was imported
//  */
// export const renameImportedComponent = (fullyQualifiedName, newName, projectId) => rpc('component', 'renameImportedComponent', fullyQualifiedName, newName, projectId);
//
// /**
//  * Delete the files of an imported component
//  *
//  * @param fullyQualifiedName the fully qualified name of the component
//  * @param projectId id of the project where the component was imported
//  */
// export const deleteImportedComponent = (fullyQualifiedName, projectId) => rpc('component', 'deleteImportedComponent', fullyQualifiedName, projectId);

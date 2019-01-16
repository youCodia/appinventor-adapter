import { rpc } from '../ai2';

/**
 * @params String - session id
 * @returns SystemConfig - including user information record
 */
const getSystemConfig = sessionId => rpc('userinfo', 'getSystemConfig', sessionId);

/**
 * Retrieve's the stored Backpack
 *
 * @return the backpack as an xml string
 */
const getUserBackpack = () => rpc('userinfo', 'getUserBackpack');

/**
 * Retrieves the user's settings.
 *
 * @return  user's settings
 */
const loadUserSettings = () => rpc('userinfo', 'loadUserSettings');

/**
 * Store the user's backpack
 * @param backpack string containing the backpack xml
 */
const storeUserBackpack = backpack => rpc('userinfo', 'storeUserBackpack', backpack);

/**
 * Stores the user's settings.
 * @param settings  user's settings
 */
const storeUserSettings = userSettings => rpc('userinfo', 'storeUserSettings', userSettings);

const hasUserFile = fileName => rpc('userinfo', 'hasUserFile', fileName);

const deleteUserFile = fileName => rpc('userinfo', 'deleteUserFile', fileName);

const UserInfo = {
  getSystemConfig,
  getUserBackpack,
  loadUserSettings,
  storeUserBackpack,
  storeUserSettings,
  hasUserFile,
  deleteUserFile,
};

export default UserInfo;

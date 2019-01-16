import { DEFAULT_LOCALE } from '../../locale';
import { get, post } from '../ai2';

export const loginOAuth = googleTokenId => post('/login/googleOAuth2', `tokenId=${googleTokenId}`);
export const login = (email, password, locale = DEFAULT_LOCALE) => post('/login', `email=${email}&password=${password}&locale=${locale}`);
export const logout = () => get('/ode/_logout?return=json');
// export const isLogged = () => !!document.cookie.match(/.*AppInventor=.*/);

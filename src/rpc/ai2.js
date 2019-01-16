import 'whatwg-fetch';
import { push } from 'react-router-redux';
import RPC, { Services } from './configs';
import { requestSerialize, responseDeserialize } from './utils/serialization';

const headerBase = {
  credentials: 'include',
  mode: 'cors',
};

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } if (response.status === 403) {
    // handle confirmTOS
    push('/confirmTOS');
  } else if (response.status === 412) {
    // handle session timeout problem
    push('/');
  }

  throw response;
}

function bodyText(response) {
  return Promise.resolve(response.text());
}

export function fileUpload(url, name, file) {
  const formData = new FormData();
  formData.append(name, file);

  const requestURL = `${RPC.HOST}${url}`;
  const options = Object.assign({
    method: 'POST',
    headers: {
      Accept: '*/*',
    },
    body: formData,
  }, headerBase);
  return fetch(requestURL, options)
    .then(checkStatus)
    .then(bodyText);
}

export function fileDownload(url) {
  const requestURL = `${RPC.HOST}${url}`;
  try {
    window.location.assign(requestURL);
  } catch (err) {
    console.log('caught error of download', err, err.status);
  }
}

export function post(url, body) {
  const requestURL = `${RPC.HOST}${url}`;
  const options = Object.assign({
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  }, headerBase);
  return fetch(requestURL, options)
    .then(checkStatus)
    .then(bodyText);
}

export function get(url) {
  const requestURL = `${RPC.HOST}${url}`;
  const options = Object.assign({
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }, headerBase);
  return fetch(requestURL, options)
    .then(checkStatus)
    .then(bodyText);
}

export function rpc(service, rpcName, ...params) {
  const requestURL = `${RPC.HOST}${Services[service].base}${Services[service].url}`;
  const body = requestSerialize(service, rpcName, ...params);
  const options = Object.assign({
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'text/x-gwt-rpc; charset=UTF-8',
      'X-GWT-Module-Base': `${RPC.HOST}${Services[service].base}/`,
      'X-GWT-Permutation': RPC.PERMUTATION_ID,
    },
    body,
  }, headerBase);
  // options.headers['Content-Type'] = 'text/x-gwt-rpc; charset=UTF-8';
  return fetch(requestURL, options)
    .then(checkStatus)
    .then(bodyText)
    .then(responseDeserialize);
}

export function syncRpc(service, rpcName, ...params) {
  const request = new XMLHttpRequest();
  const requestURL = `${RPC.HOST}${Services[service].base}${Services[service].url}`;
  const body = requestSerialize(service, rpcName, ...params);
  request.open('POST', requestURL, false);
  request.setRequestHeader('Accept', '*/*');
  request.setRequestHeader('Content-Type', 'text/x-gwt-rpc; charset=UTF-8');
  request.setRequestHeader('X-GWT-Module-Base', `${RPC.HOST}${Services[service].base}/`);
  request.setRequestHeader('X-GWT-Permutation', RPC.PERMUTATION_ID);
  request.withCredentials = true;
  request.send(body);
  return responseDeserialize(request.responseText);
}

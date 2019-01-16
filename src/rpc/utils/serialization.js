import isNumber from 'lodash/isNumber';
import isArray from 'lodash/isArray';
import { encode64 } from './base64';
import { parseData } from './rpcParser';
import RPC, { Services, Types } from '../configs';
import NewProjectParameters from '../models/NewProjectParameters';
import FileDescriptorWithContent from '../models/FileDescriptorWithContent';

export function requestSerialize(service, rpcName, ...params) {
  const serviceData = Services[service];
  // 7|0|
  const content = [RPC.VERSION, RPC.FLAG];

  // request data
  const strData = [];
  const arrData = [];
  const insertStr = (str) => {
    const i = strData.indexOf(str);
    if (i === -1) {
      strData.push(str);
      arrData.push(strData.length);
    } else {
      arrData.push(i + 1);
    }
  };

  insertStr(`${RPC.HOST}${serviceData.base}/`); // Servlet URL
  insertStr(serviceData.policyName); // Strong Name
  insertStr(serviceData.serviceFile); // Service Class
  insertStr(rpcName); // Service Method

  // number of params
  arrData.push(params.length);

  const pushType = (param) => {
    if (typeof param === 'string') {
      insertStr(Types.string);
    } else if (typeof param === 'number') {
      insertStr(Math.abs(param) > 2147483647 ? Types.long : Types.int);
    } else if (typeof param === 'boolean') {
      insertStr(Types.boolean);
    } else if (isArray(param)) {
      insertStr(Types.list);
    } else if (param instanceof NewProjectParameters) {
      insertStr('com.google.appinventor.shared.rpc.project.NewProjectParameters');
    }
  };
  const pushValue = (param) => {
    if (typeof param === 'string') {
      insertStr(param.replace(/\|/g, '\\!'));
    } else if (typeof param === 'number') {
      arrData.push(Math.abs(param) > 2147483647 ? encode64(param) : param);
    } else if (typeof param === 'boolean') {
      arrData.push(param ? '1' : '0');
    } else if (isArray(param)) {
      insertStr(Types.array);
      arrData.push(param.length);
      param.forEach((data) => {
        pushType(data);
        pushValue(data);
      });
    } else if (param instanceof NewProjectParameters) {
      insertStr(Types.newProjectParameters);
      insertStr(param.formName);
      insertStr(param.packageName);
    } else if (param instanceof FileDescriptorWithContent) {
      insertStr(Types.fileDescriptorWithContent);
      pushValue(param.content.replace(/\\/g, '\\\\'));
      pushValue(param.fileId);
      pushValue(param.projectId);
    }
  };

  if (params.length > 0) {
    params.forEach((param) => {
      pushType(param);
    });
    params.forEach((param) => {
      pushValue(param);
    });
  }

  content.push(strData.length, ...strData, ...arrData);
  return `${content.join('|')}|`;
}

export async function responseDeserialize(text) {
  if (!text.match('//OK')) {
    throw new Error(`RPC Response Error: ${text}`);
  }
  console.log(text.substr(4).replace(/"\+"/g, ''));
  const json = JSON.parse(text.substr(4).replace(/"\+"/g, ''));
  const version = json.pop();
  if (version !== RPC.VERSION) {
    throw new Error(`RPC Version Not Match: ${version}`);
  }
  const flag = json.pop();
  if (flag !== RPC.FLAG) {
    throw new Error(`RPC Flag Not Match: ${version}`);
  }
  const strData = json.pop();
  if (strData.length === 0 && json.length === 1) {
    if (isNumber(json[0]) && (json[0] === 0 || json[0] === 1)) {
      return json[0] === 1;
    }
    return json[0];
  }
  const result = await parseData(strData, json);
  return result;
}

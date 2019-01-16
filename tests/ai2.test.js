/**
 * Test the request function
 */

import {
  post, get, fileDownload, syncRpc,
} from '../src/rpc/ai2';
import RPC from '../src/rpc/configs';
import { responseDeserialize } from '../src/rpc/utils/serialization';

jest.mock('react-router-redux');
const mockedPush = require('react-router-redux').push;

describe('ai2 request', () => {
  // Before each tests, stub the fetch function
  beforeEach(() => {
    window.fetch = jest.fn();
  });

  describe('stubbing successful post response', () => {
    // Before each tests, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('OK', {
        status: 200,
        headers: {
          'Content-type': 'application/text',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should get the response correctly from POST', (done) => {
      post('/thisurliscorrect', { data: 'some data' })
        .catch(done)
        .then((str) => {
          expect(str).toBe('OK');
          done();
        });
    });

    it('should get the response correctly from GET', (done) => {
      get('/thisurliscorrect', { data: 'some data' })
        .catch(done)
        .then((str) => {
          expect(str).toBe('OK');
          done();
        });
    });
  });

  describe('handle confirmTOS', () => {
    // Before each tests, pretend we got an unsuccessful response
    beforeEach(() => {
      const res = new Response('', {
        status: 403,
        statusText: 'Forbidden',
        headers: {
          'Content-type': 'application/t',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
      mockedPush.mockReset();
    });

    it('should catch errors from POST', async (done) => {
      post('/thisurliscorrect', { data: 'some data' })
        .catch(done)
        .then(() => {
          expect(mockedPush).toHaveBeenCalledWith('/confirmTOS');
          done();
        });
    });

    it('should catch errors from GET', (done) => {
      get('/thisurliscorrect', { data: 'some data' })
        .catch(done)
        .then(() => {
          expect(mockedPush).toHaveBeenCalledWith('/confirmTOS');
          done();
        });
    });
  });

  describe('Session Timeout', () => {
    // Before each tests, pretend we got an unsuccessful response
    beforeEach(() => {
      const res = new Response('', {
        status: 412,
        statusText: 'Session Timeout',
        headers: {
          'Content-type': 'application/t',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
      mockedPush.mockReset();
    });

    it('should catch errors from POST', async (done) => {
      post('/thisurliscorrect', { data: 'some data' })
        .catch(done)
        .then(() => {
          expect(mockedPush).toHaveBeenCalledWith('/');
          done();
        });
    });

    it('should catch errors from GET', (done) => {
      get('/thisurliscorrect', { data: 'some data' })
        .catch(done)
        .then(() => {
          expect(mockedPush).toHaveBeenCalledWith('/');
          done();
        });
    });
  });

  describe('file download', () => {
    it('should get the reponse correctly', () => {
      global.window.location.assign = jest.fn();
      const url = '/tests';
      fileDownload(url);
      expect(window.location.assign).toHaveBeenCalledWith(RPC.HOST + url);
    });
  });

  describe('syncRpc', () => {
    let mockedRequest;
    // Before each tests, pretend we got a successful response
    beforeEach(() => {
      mockedRequest = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(),
        responseText: '12345678',
      };
      window.XMLHttpRequest = jest.fn(() => mockedRequest);
    });

    it('should request synRpc correctly', async () => {
      const sessionId = '1234567';
      const projectId = '3456789';
      const fileId = '3456789';
      const force = false;
      const content = {};
      const response = syncRpc('project', 'save2', sessionId, projectId, fileId, force, content);
      expect(response).toEqual(responseDeserialize(mockedRequest.responseText));
    });
  });
});

import {
  getSystemConfig, getUserBackpack, loadUserSettings, storeUserBackpack, storeUserSettings,
} from '../src/rpc/modules/userinfo';
import UserConfig from '../src/rpc/models/Config';
import { Types } from '../src/rpc/configs';

describe('rpc/userinfo', () => {
  beforeEach(() => {
    window.fetch = jest.fn();
  });

  describe('getSystemConfig', () => {
    it('should make a post request for getSystemConfig', (done) => {
      const res = new Response(`//OK[0,1,20,0,18,5,0,0,19,5,18,0,17,16,15,14,350,0,100,13,12,11,10,9,0,8,7,7,5,6,5,4,3,2,1,["${Types.config}","clouddb.example.com","http://appinventor.mit.edu/extensions","http://something.example.com","","https://groups.google.com/forum/#!forum/mitappinventortest","http://appinventor.mit.edu/explore/library","http://appinventor.mit.edu","/reference/components/","http://appinventor.mit.edu/ai2/ReleaseNotes.html","https://projc-ai3-stg.ygn.org.hk:11211","com.google.appinventor.shared.rpc.user.SplashConfig/917897862","<b>Welcome to MIT App Inventor</b>","/about/termsofservice.html","http://appinventor.mit.edu/explore/ai2/support/troubleshooting","http://appinventor.mit.edu/explore/ai2/tutorials","${Types.user}","warren922","dc90a821-ceef-4879-a2ec-d2cf592f4a91","fb005622-209e-4952-8ab8-c0085e266247"],0,7]`, {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      getSystemConfig()
        .catch(done)
        .then((resp) => {
          expect(resp instanceof UserConfig).toEqual(true);
          done();
        });
    });
  });

  describe('getUserBackpack', () => {
    it('should make a post request for getUserBackpack', (done) => {
      const res = new Response('//OK[1,["[]"],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      getUserBackpack()
        .catch(done)
        .then((resp) => {
          expect(resp).toEqual('[]');
          done();
        });
    });
  });

  describe('loadUserSettings', () => {
    it('should make a post request for loadUserSettings', (done) => {
      const res = new Response('//OK[1,[""],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      loadUserSettings()
        .catch(done)
        .then((resp) => {
          expect(resp).toEqual('');
          done();
        });
    });
  });

  describe('storeUserBackpack', () => {
    it('should make a post request for storeUserBackpack', (done) => {
      const res = new Response('//OK[1,[""],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      storeUserBackpack()
        .catch(done)
        .then((resp) => {
          expect(resp).toEqual('');
          done();
        });
    });
  });

  describe('storeUserSettings', () => {
    it('should make a post request for storeUserSettings', (done) => {
      const res = new Response('//OK[1,[""],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      storeUserSettings()
        .catch(done)
        .then((resp) => {
          expect(resp).toEqual('');
          done();
        });
    });
  });
});

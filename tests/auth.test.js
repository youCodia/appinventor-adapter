import { loginOAuth, logout } from '../src/rpc/modules/auth';

describe('rpc/auth', () => {
  beforeEach(() => {
    window.fetch = jest.fn();
  });

  describe('login/logout', () => {
    beforeEach(() => {
      const res = new Response('OK', {
        status: 200,
        headers: {
          'Content-type': 'application/json',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should make a post request for login', (done) => {
      loginOAuth('feiabfiowaf')
        .catch(done)
        .then((text) => {
          expect(text).toBe('OK');
          done();
        });
    });

    it('should make a get request for logout', (done) => {
      logout()
        .catch(done)
        .then((text) => {
          expect(text).toBe('OK');
          done();
        });
    });
  });
});

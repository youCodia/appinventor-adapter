import { acceptTOS } from '../lib/appinventor-adapter.cjs';

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

    it('should make a post request for acceptTOS', (done) => {
      acceptTOS()
        .catch(done)
        .then((text) => {
          expect(text).toBe('OK');
          done();
        });
    });
  });
});

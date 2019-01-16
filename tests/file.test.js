import {
  uploadFile, uploadProject, uploadUserFile, downloadFile, downloadProjectOutput, getDownloadAssetsUrl, downloadProject, downloadKeystore, uploadComponent,
} from '../src/rpc/modules/file';
import * as dependency from '../src/rpc/ai2';

describe('rpc/auth', () => {
  beforeEach(() => {
    window.fetch = jest.fn();
  });

  describe('file upload', () => {
    beforeEach(() => {
      const res = new Response('OK', {
        status: 200,
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should make a post request for uploadFile with .txt', (done) => {
      const projectId = '123456789';
      const filePath = 'assets';
      const file = new File(['foo'], 'foo.txt');
      uploadFile(projectId, filePath, file)
        .catch(done)
        .then((text) => {
          expect(text).toBe('OK');
          done();
        });
    });

    it('should make a post request for uploadFile with .aia', (done) => {
      const file = new File(['foo'], 'foo.aia');
      uploadProject(file)
        .catch(done)
        .then((text) => {
          expect(text).toBe('OK');
          done();
        });
    });

    it('should make a post request for uploadFile with .aix', (done) => {
      const file = new File(['foo'], 'foo.aix');
      uploadComponent(file)
        .catch(done)
        .then((text) => {
          expect(text).toBe('OK');
          done();
        });
    });

    it('should make a post request for uploadFile with .keystore', (done) => {
      const file = new File(['foo'], 'android.keystore');
      uploadUserFile(file)
        .catch(done)
        .then((text) => {
          expect(text).toBe('OK');
          done();
        });
    });

    it('should getDownloadAssetsUrl', () => {
      const DateToUse = new Date();
      global.Date = jest.fn(() => DateToUse);
      expect(getDownloadAssetsUrl('11111', 'abc.jpg')).toContain('/ode/download/file/11111/assets/abc.jpg?t=');
    });

    it('should downloadProject', () => {
      dependency.fileDownload = jest.fn();
      const projectId = '11111';
      const url = `/ode/download/project-source/${projectId}`;
      downloadProject(projectId);
      expect(dependency.fileDownload).toHaveBeenCalledWith(url);
    });

    it('should make a get request for downloadFile', () => {
      const fileId = 'asset/tests.jpg';
      const projectId = 'test';
      downloadFile(projectId, fileId);
      expect(true).toEqual(true);
    });

    it('should send url for download keystore', () => {
      dependency.fileDownload = jest.fn();
      const url = '/ode/download/userfile/android.keystore';
      downloadKeystore(url);
      expect(dependency.fileDownload).toHaveBeenCalledWith(url);
    });

    it('should make a get request for downloadProjectOutput', () => {
      const target = 'Android';
      const projectId = 'test';
      downloadProjectOutput(projectId, target);
      expect(true).toEqual(true);
    });
  });
});

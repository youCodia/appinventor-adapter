import YoungAndroidProjectNode from '../src/rpc/models/YoungAndroidProjectNode';
import {
  getProjectInfos,
  retrieveTemplateData,
  loadProjectSettings,
  getProject,
  load2,
  loadraw2,
  deleteFile,
  deleteProject,
  save,
  save2,
  addFile,
  newProject,
  copyProject, build, getBuildResult,
} from '../src/rpc/modules/projects';

describe('rpc/projects', () => {
  beforeEach(() => {
    window.fetch = jest.fn();
  });

  describe('getProjectsInfos', () => {
    it('should make a post request for getProjectInfos', (done) => {
      const res = new Response('//OK[0,1,["java.util.ArrayList/4159755760"],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      getProjectInfos()
        .catch(done)
        .then((resp) => {
          expect(resp).toEqual([]);
          done();
        });
    });

    it('should make a get request for logout', (done) => {
      const result = '[{\\"name\\":\\"BLuetoothLEStarter\\",\\"subtitle\\":\\"MIT App Inventor BLuetoothLE starter project\\",\\"description\\":\\" This template allow you to create a generic BluetoothLE enabled application.\\",\\"link\\":\\"\\",\\"thumbnail\\":\\"bluetooth.png\\",\\"screenshot\\":\\"BluetoothLE_Starter.png\\"}, {\\"name\\": \\"HelloPurr\\", \\"subtitle\\": \\"A purring kitty app\\", \\"description\\": \\"\u003Cp\u003EThis is App Inventor\u0027s version of the HelloWorld app. For more information see the \u003Ca href\u003D\u0027http://appinventor.mit.edu/explore/content/hellopurr.html\u0027 target\u003D\u0027_blank\u0027\u003EHelloPurr tutorial\u003C/a\u003E.\\", \\"screenshot\\": \\"screenshot.png\\", \\"thumbnail\\":\\"thumbnail.png\\"}, ]';
      const res = new Response(`//OK[1,["${result}"],0,7]`, {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      retrieveTemplateData()
        .catch(done)
        .then((text) => {
          expect(text).toEqual(result.replace(/\\"/g, '"'));
          done();
        });
    });

    it('should make projects settings call', (done) => {
      const result = '{\\"SimpleSettings\\":{\\"Icon\\":\\"\\",\\"VersionCode\\":\\"1\\",\\"VersionName\\":\\"1.0\\",\\"UsesLocation\\":\\"false\\",\\"AppName\\":\\"Test\\",\\"Sizing\\":\\"Fixed\\",\\"ShowListsAsJson\\":\\"false\\"}}';
      const res = new Response(`//OK[1,["${result}"],0,7]`, {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      loadProjectSettings()
        .catch(done)
        .then((text) => {
          expect(text).toEqual(result.replace(/\\"/g, '"'));
          done();
        });
    });

    it('should make projects settings call', (done) => {
      const res = new Response('//OK[0,26,25,-1,24,23,0,22,-1,21,20,-4,19,18,-6,17,16,0,15,-6,14,13,0,12,-6,11,10,0,9,3,3,8,1,3,7,-1,6,5,0,4,3,3,2,"WAAAAAAAA",1,["com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidProjectNode/3999559536","YoungAndroid","java.util.ArrayList/4159755760","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidAssetsFolder/3524809606","assets","Assets","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidSourceFolderNode/1539202537","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidPackageNode/404162700","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidBlocksNode/1973959899","src/appinventor/ai_test/Test/Screen1.bky","Screen1.bky","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidFormNode/3242031682","src/appinventor/ai_test/Test/Screen1.scm","Screen1.scm","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidYailNode/3020652743","src/appinventor/ai_test/Test/Screen1.yail","Screen1.yail","src/appinventor/ai_test/Test","appinventor.ai_test.Test","src","Sources","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidComponentsFolder/4058810426","assets/external_comps","Components","6192449487634432","Test"],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      getProject()
        .catch(done)
        .then((projectNode) => {
          expect(projectNode instanceof YoungAndroidProjectNode).toEqual(true);
          done();
        });
    });

    it('should make load2 call', (done) => {
      const res = new Response('//OK[3,2,1,["com.google.appinventor.shared.rpc.project.ChecksumedLoadFile/4017192298","2df84d00636d22199431bfa8c2362088","#|$JSON{\\"authURL\\":[],\\"YaVersion\\":\\"159\\",\\"Source\\":\\"Form\\",\\"Properties\\":{\\"$Name\\":\\"Screen1\\",\\"$Type\\":\\"Form\\",\\"$Version\\":\\"20\\",\\"Uuid\\":\\"0\\",\\"Title\\":\\"Screen1\\",\\"AppName\\":\\"Test\\"}}|#"],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      load2()
        .catch(done)
        .then((data) => {
          expect(data).toBeUndefined();
          done();
        });
    });

    it('should make loadraw2 call', (done) => {
      const res = new Response('//OK[3,2,1,["com.google.appinventor.shared.rpc.project.ChecksumedLoadFile/4017192298","2df84d00636d22199431bfa8c2362088","#|$JSON{\\"authURL\\":[],\\"YaVersion\\":\\"159\\",\\"Source\\":\\"Form\\",\\"Properties\\":{\\"$Name\\":\\"Screen1\\",\\"$Type\\":\\"Form\\",\\"$Version\\":\\"20\\",\\"Uuid\\":\\"0\\",\\"Title\\":\\"Screen1\\",\\"AppName\\":\\"Test\\"}}|#"],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      loadraw2()
        .catch(done)
        .then((data) => {
          expect(data).toBeUndefined();
          done();
        });
    });

    it('should make save2 call', (done) => {
      const res = new Response('//OK["Vw5N_vP",[],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      save2()
        .catch(done)
        .then((data) => {
          expect(data).toEqual('Vw5N_vP');
          done();
        });
    });

    it('should make deleteFile call', (done) => {
      const res = new Response('//OK["Vw5OhAu",[],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      deleteFile()
        .catch(done)
        .then((data) => {
          expect(data).toEqual('Vw5OhAu');
          done();
        });
    });

    it('should make deleteProject call', (done) => {
      const res = new Response('//OK["Vw5OhAu",[],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      deleteProject()
        .catch(done)
        .then((data) => {
          expect(data).toEqual('Vw5OhAu');
          done();
        });
    });

    it('should make addFile call', (done) => {
      const res = new Response('//OK["Vw5N_vP",[],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      addFile()
        .catch(done)
        .then((data) => {
          expect(data).toEqual('Vw5N_vP');
          done();
        });
    });

    it('should make newProject call', (done) => {
      const res = new Response('//OK[3,2,"WAAAAAAAA","Vw4oyMS","A","Vw4oyMS","A",1,["com.google.appinventor.shared.rpc.project.UserProject/4051224674","Test","YoungAndroid"],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      newProject()
        .catch(done)
        .then((data) => {
          expect(data.projectId).toEqual(6192449487634432);
          done();
        });
    });

    it('should make copyProject call', (done) => {
      const res = new Response('//OK[3,2,"TAAAAAAAA","Vw41rDC","A","Vw41rDC","A",1,["com.google.appinventor.shared.rpc.project.UserProject/4051224674","Test2","YoungAndroid"],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      copyProject()
        .catch(done)
        .then((data) => {
          expect(data.projectId).toEqual(5348024557502464);
          done();
        });
    });

    it('should make save call', (done) => {
      const res = new Response('//OK["Vw4t9P1",[],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      save()
        .catch(done)
        .then((data) => {
          expect(data).toEqual('Vw4t9P1');
          done();
        });
    });

    it('should make build call', (done) => {
      const res = new Response('//OK[-1,3,0,2,1,["com.google.appinventor.shared.rpc.RpcResult/2898401967","Could not fetch URL: http://localhost:9990/buildserver/build-all-from-zip-async?uname\u003Dtest%40fxxk.com\u0026gitBuildVersion\u003Dnls-1027-gf1510156\u0026callback\u003Dhttp%3A%2F%2Flocalhost%3A8888%2Fode2%2Freceivebuild%2Fd7vgiqpmf3c1ikyxmxfnekchmag0ns926bc3bqk3lnnwoxi96l0vrg51ty8gul7oh6mvf49rlmlgzryjdupggkbr5q6rl10ryn3718e1pva3u6vi0w61fu5r44kd9gdufquq33gcry%2Fbuild%2FAndroid, error: Received exception executing http method POST against URL http://localhost:9990/buildserver/build-all-from-zip-async?uname\u003Dtest%40fxxk.com\u0026gitBuildVersion\u003Dnls-1027-gf1510156\u0026callback\u003Dhttp%3A%2F%2Flocalhost%3A8888%2Fode2%2Freceivebuild%2Fd7vgiqpmf3c1ikyxmxfnekchmag0ns926bc3bqk3lnnwoxi96l0vrg51ty8gul7oh6mvf49rlmlgzryjdupggkbr5q6rl10ryn3718e1pva3u6vi0w61fu5r44kd9gdufquq33gcry%2Fbuild%2FAndroid: Connection to http://localhost:9990 refused",""],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      build()
        .catch(done)
        .then((data) => {
          expect(data.result).toEqual(-1);
          done();
        });
    });

    it('should make getBuildResult call', (done) => {
      const res = new Response('//OK["Vw4t9P1",[],0,7]', {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      getBuildResult()
        .catch(done)
        .then((data) => {
          expect(data).toEqual('Vw4t9P1');
          done();
        });
    });
  });
});

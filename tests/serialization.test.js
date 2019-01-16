import User from '../src/rpc/models/User';
import Config from '../src/rpc/models/Config';
import NewProjectParameters from '../src/rpc/models/NewProjectParameters';
import YoungAndroidProjectNode from '../src/rpc/models/YoungAndroidProjectNode';
import ChecksumedLoadFile from '../src/rpc/models/ChecksumedLoadFile';
import FileDescriptorWithContent from '../src/rpc/models/FileDescriptorWithContent';
import RpcResult from '../src/rpc/models/RpcResult';
import { requestSerialize, responseDeserialize } from '../src/rpc/utils/serialization';
import { decode64, encode64 } from '../src/rpc/utils/base64';
import RPC, { Services, Types } from '../src/rpc/configs';

describe('rpc utils', () => {
  describe('requestSerialize', () => {
    it('should create getProjectInfos', () => {
      const payload = requestSerialize('project', 'getProjectInfos');
      const result = `7|0|4|${RPC.HOST}/ode/|${Services.project.policyName}|com.google.appinventor.shared.rpc.project.ProjectService|getProjectInfos|1|2|3|4|0|`;
      expect(payload).toEqual(result);
    });

    it('should create getProjectInfos with params', () => {
      const payload = requestSerialize('project', 'getProjectInfos', 'test', 'test');
      const result = `7|0|6|${RPC.HOST}/ode/|${Services.project.policyName}|com.google.appinventor.shared.rpc.project.ProjectService|getProjectInfos|java.lang.String/2004016611|test|1|2|3|4|2|5|5|6|6|`;
      expect(payload).toEqual(result);
    });

    it('should create getProject with projectId', () => {
      const payload = requestSerialize('project', 'getProject', 33923456789);
      const result = `7|0|5|${RPC.HOST}/ode/|${Services.project.policyName}|com.google.appinventor.shared.rpc.project.ProjectService|getProject|J|1|2|3|4|1|5|fl_t8V|`;
      expect(payload).toEqual(result);
    });

    it('should create getProject with projectId', () => {
      const sessionId = '43635e86-b48c-4717-8ecd-d77679f8c647';
      const projectId = decode64('RAAAAAAAA');
      const fileId = 'src/appinventor/ai_cscklab/Test1/Screen1.scm';
      const force = false;
      const content = '#!\n$JSON\n{"authURL":["localhost"],"YaVersion":"159","Source":"Form","Properties":{"$Name":"Screen1","$Type":"Form","$Version":"20","AppName":"Test1","Title":"Screen1","Uuid":"0","$Components":[{"$Name":"CheckBox2","$Type":"CheckBox","$Version":"2","Text":"Text for CheckBox2","Uuid":"-1518454633"},{"$Name":"Image1","$Type":"Image","$Version":"3","Uuid":"2003702174"},{"$Name":"Button2","$Type":"Button","$Version":"6","Text":"Text for Button2","Uuid":"-796666187"},{"$Name":"Button1","$Type":"Button","$Version":"6","BackgroundColor":"&HFFFFC800","Shape":"1","Text":"Text for Button1","Uuid":"-980585151"},{"$Name":"CheckBox1","$Type":"CheckBox","$Version":"2","BackgroundColor":"&HFFFF00FF","Checked":"True","FontTypeface":"1","Text":"Text for CheckBox1","Uuid":"1931836838"},{"$Name":"Spinner1","$Type":"Spinner","$Version":"1","ElementsFromString":"ABC,ABCD,NKE","Prompt":"FEWF","Selection":"FWFEA","Uuid":"-2041058055"},{"$Name":"HorizontalScrollArrangement2","$Type":"HorizontalScrollArrangement","$Version":"1","Uuid":"977493207"},{"$Name":"Gd","$Type":"TableArrangement","$Version":"1","Columns":"6","Width":"777","Uuid":"45626363","$Components":[{"$Name":"VerticalArrangement1","$Type":"VerticalArrangement","$Version":"3","Column":"1","Row":"0","Uuid":"1562918662","$Components":[{"$Name":"VerticalScrollArrangement1","$Type":"VerticalScrollArrangement","$Version":"1","Uuid":"1041411113"}]},{"$Name":"TextBox1","$Type":"TextBox","$Version":"5","Column":"4","FontSize":"18","Hint":"Hint for TextBox1","Row":"0","Uuid":"-774911914"}]},{"$Name":"Player1","$Type":"Player","$Version":"6","Uuid":"30209211"},{"$Name":"Camera1","$Type":"Camera","$Version":"3","Uuid":"-350634069"},{"$Name":"Camcorder1","$Type":"Camcorder","$Version":"1","Uuid":"-83636060"},{"$Name":"Ev3ColorSensor1","$Type":"Ev3ColorSensor","$Version":"1","Uuid":"-1343586781"}]}}\n!#';
      const payload = requestSerialize('project', 'save2', sessionId, projectId, fileId, force, content);
      const result = `7|0|10|${RPC.HOST}/ode/|${Services.project.policyName}|com.google.appinventor.shared.rpc.project.ProjectService|save2|java.lang.String/2004016611|J|Z|${sessionId}|${fileId}|${content}|1|2|3|4|5|5|6|5|7|5|8|${encode64(projectId)}|9|0|10|`;
      expect(payload).toEqual(result);
    });

    it('should createProject with projectId', () => {
      const projectType = 'YoungAndroid';
      const projectName = 'test';
      const formName = 'Screen1';
      const packageName = `appinventor.ai_test.${projectName}`;
      const params = new NewProjectParameters(formName, packageName);
      const payload = requestSerialize('project', 'newProject', projectType, projectName, params);
      const result = `7|0|11|${RPC.HOST}/ode/|${Services.project.policyName}|com.google.appinventor.shared.rpc.project.ProjectService|newProject|java.lang.String/2004016611|com.google.appinventor.shared.rpc.project.NewProjectParameters|${projectType}|${projectName}|com.google.appinventor.shared.rpc.project.youngandroid.NewYoungAndroidProjectParameters/3790764037|${params.formName}|${params.packageName}|1|2|3|4|3|5|5|6|7|8|9|10|11|`;
      expect(payload).toEqual(result);
    });

    it('should save with array of FileDescriptorWithContent', () => {
      const sessionId = '43635e86-b48c-4717-8ecd-d77679f8c647';
      const projectId = decode64('RAAAAAAAA');
      const fileId = 'src/appinventor/ai_cscklab/Test1/ScreenTest.scm';
      const testContent = 'testContent';
      const filesAndContent = [new FileDescriptorWithContent(testContent, fileId, projectId)];
      const payload = requestSerialize('project', 'save', sessionId, filesAndContent);
      const result = `7|0|11|${RPC.HOST}/ode/|${Services.project.policyName}|com.google.appinventor.shared.rpc.project.ProjectService|save|java.lang.String/2004016611|java.util.List|${sessionId}|java.util.ArrayList/4159755760|com.google.appinventor.shared.rpc.project.FileDescriptorWithContent/2971559239|${testContent}|${fileId}|1|2|3|4|2|5|6|7|8|1|9|10|11|${encode64(projectId)}|`;
      expect(payload).toEqual(result);
    });
  });

  describe('responseDeserialize', () => {
    it('should parse error with version not match', (done) => {
      const test = responseDeserialize('//ER');
      test.catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toMatch('RPC Response Error');
        done();
      });
    });

    it('should parse error with version not match', (done) => {
      const test = responseDeserialize('//OK[1,[],0,6]');
      test.catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toMatch('RPC Version Not Match');
        done();
      });
    });

    it('should parse error with version not match', (done) => {
      const test = responseDeserialize('//OK[1,[],1,7]');
      test.catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toMatch('RPC Flag Not Match');
        done();
      });
    });

    it('should parse boolean correctly', (done) => {
      const result = true;
      const payload = responseDeserialize('//OK[1,[],0,7]');
      payload.then((str) => {
        expect(str).toBe(result);
        done();
      });
    });

    it('should parse save as call string correctly', (done) => {
      const result = 'Vw4t9P1';
      const payload = responseDeserialize('//OK["Vw4t9P1",[],0,7]');
      payload.then((str) => {
        expect(str).toBe(result);
        done();
      });
    });

    it('should parse string correctly', (done) => {
      const result = 'tests only';
      const payload = responseDeserialize(`//OK[2,1,["java.lang.String/2004016611", "${result}"],0,7]`);
      payload.then((str) => {
        expect(str).toBe(result);
        done();
      });
    });

    it('should parse empty string correctly', (done) => {
      const payload = responseDeserialize('//OK[0,1,["java.lang.String/2004016611"],0,7]');
      payload.then((str) => {
        expect(!!str).toEqual(false);
        done();
      });
    });

    it('should parse empty array correctly', (done) => {
      const payload = responseDeserialize('//OK[0,1,["java.util.ArrayList/4159755760"],0,7]');
      const result = [];
      payload.then((arr) => {
        expect(arr).toEqual(result);
        done();
      });
    });

    it('should parse json string', (done) => {
      const json = '[{\\"name\\":\\"BLuetoothLEStarter\\",\\"subtitle\\":\\"MIT App Inventor BLuetoothLE starter project\\",\\"description\\":\\" This template allow you to create a generic BluetoothLE enabled application.\\",\\"link\\":\\"\\",\\"thumbnail\\":\\"bluetooth.png\\",\\"screenshot\\":\\"BluetoothLE_Starter.png\\"}, {\\"name\\": \\"HelloPurr\\", \\"subtitle\\": \\"A purring kitty app\\", \\"description\\": \\"\u003Cp\u003EThis is App Inventor\u0027s version of the HelloWorld app. For more information see the \u003Ca href\u003D\u0027http://appinventor.mit.edu/explore/content/hellopurr.html\u0027 target\u003D\u0027_blank\u0027\u003EHelloPurr tutorial\u003C/a\u003E.\\", \\"screenshot\\": \\"screenshot.png\\", \\"thumbnail\\":\\"thumbnail.png\\"}, ]';
      const payload = responseDeserialize(`//OK[1,["${json}"],0,7]`);
      payload.then((jsonStr) => {
        expect(jsonStr).toEqual(json.replace(/\\"/g, '"'));
        done();
      });
    });

    it('should parse config', (done) => {
      const payload = responseDeserialize(`//OK[0,1,19,0,18,4,0,0,17,5,16,15,14,13,12,350,0,100,11,10,0,9,8,0,7,6,6,4,5,4,3,2,1,["${Types.config}","http://appinventor.mit.edu/extensions","http://something.example.com","","https://groups.google.com/forum/#!forum/mitappinventortest","http://appinventor.mit.edu/explore/library","http://appinventor.mit.edu","/reference/components/","http://appinventor.mit.edu/ai2/ReleaseNotes.html","com.google.appinventor.shared.rpc.user.SplashConfig/917897862","<b>Welcome to MIT App Inventor</b>","/about/termsofservice.html","http://appinventor.mit.edu/explore/ai2/support/troubleshooting","http://appinventor.mit.edu/explore/ai2/tutorials","com.google.appinventor.shared.rpc.user.User/4067024749","test@fxxk.com","180180237163219141481","test","d656f667-b9e6-427b-9724-5e1dff3720fc"],0,7]`);
      payload.then((config) => {
        expect(config instanceof Config).toEqual(true);
        expect(config.user instanceof User).toEqual(true);
        done();
      });
    });

    it('should create userProject', (done) => {
      const payload = responseDeserialize('//OK[4,3,"UgAAAAAAA","Vx43qfJ","A","Vx43qfJ","A",2,1,1,["java.util.ArrayList/4159755760","com.google.appinventor.shared.rpc.project.UserProject/4051224674","Test1","YoungAndroid"],0,7]');
      payload.then((projects) => {
        expect(projects.length).toEqual(1);
        done();
      });
    });

    it('should parse ProjectNode', (done) => {
      const payload = responseDeserialize('//OK[0,26,25,-1,24,23,0,22,-1,21,20,-4,19,18,-6,17,16,0,15,-6,14,13,0,12,-6,11,10,0,9,3,3,8,1,3,7,-1,6,5,0,4,3,3,2,"WAAAAAAAA",1,["com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidProjectNode/3999559536","YoungAndroid","java.util.ArrayList/4159755760","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidAssetsFolder/3524809606","assets","Assets","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidSourceFolderNode/1539202537","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidPackageNode/404162700","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidBlocksNode/1973959899","src/appinventor/ai_test/Test/Screen1.bky","Screen1.bky","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidFormNode/3242031682","src/appinventor/ai_test/Test/Screen1.scm","Screen1.scm","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidYailNode/3020652743","src/appinventor/ai_test/Test/Screen1.yail","Screen1.yail","src/appinventor/ai_test/Test","appinventor.ai_test.Test","src","Sources","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidComponentsFolder/4058810426","assets/external_comps","Components","6192449487634432","Test"],0,7]');
      payload.then((node) => {
        expect(node instanceof YoungAndroidProjectNode).toEqual(true);
        done();
      });
    });

    it('should parse empty ChecksumedLoadFile', (done) => {
      const payload = responseDeserialize('//OK[3,2,1,["com.google.appinventor.shared.rpc.project.ChecksumedLoadFile/4017192298","d41d8cd98f00b204e9800998ecf8427e",""],0,7]');
      payload.then((node) => {
        expect(node instanceof ChecksumedLoadFile).toEqual(true);
        done();
      });
    });

    it('should parse RpcResult', (done) => {
      const payload = responseDeserialize('//OK[0,4,3,2,1,["com.google.appinventor.shared.rpc.RpcResult/2898401967","","{\\"result\\":0,\\"error\\":\\"\\",\\"output\\":\\"________Preparing application icon\u003Cbr\u003E________Creating animation xml\u003Cbr\u003E________Generating manifest file\u003Cbr\u003E________Attaching native libraries\u003Cbr\u003E________Attaching component assets\u003Cbr\u003E________Compiling source files\u003Cbr\u003E(compiling appinventor\\\\/ai_cscklab\\\\/Test_checkpoint6\\\\/Screen1.yail to appinventor.ai_cscklab.Test_checkpoint6.Screen1)\u003Cbr\u003E(compiling \\\\/var\\\\/folders\\\\/yx\\\\/07j35nd93fg8y22fq3_1zvy80000gp\\\\/T\\\\/runtime6356921641959658501.scm to com.google.youngandroid.runtime)\u003Cbr\u003EKawa compile time: 1.237 seconds\u003Cbr\u003E________Invoking DX\u003Cbr\u003EDX time: 2.898 seconds\u003Cbr\u003E________Invoking AAPT\u003Cbr\u003EAAPT time: 0.038 seconds\u003Cbr\u003E________Invoking ApkBuilder\u003Cbr\u003E________Signing the apk file\u003Cbr\u003E________ZipAligning the apk file\u003Cbr\u003EZIPALIGN time: 0.016 seconds\u003Cbr\u003EBuild finished in 5.719 seconds\u003Cbr\u003E\\"}","________Preparing application icon\u003Cbr\u003E________Creating animation xml\u003Cbr\u003E________Generating manifest file\u003Cbr\u003E________Attaching native libraries\u003Cbr\u003E________Attaching component assets\u003Cbr\u003E________Compiling source files\u003Cbr\u003E(compiling appinventor/ai_cscklab/Test_checkpoint6/Screen1.yail to appinventor.ai_cscklab.Test_checkpoint6.Screen1)\u003Cbr\u003E(compiling /var/folders/yx/07j35nd93fg8y22fq3_1zvy80000gp/T/runtime6356921641959658501.scm to com.google.youngandroid.runtime)\u003Cbr\u003EKawa compile time: 1.237 seconds\u003Cbr\u003E________Invoking DX\u003Cbr\u003EDX time: 2.898 seconds\u003Cbr\u003E________Invoking AAPT\u003Cbr\u003EAAPT time: 0.038 seconds\u003Cbr\u003E________Invoking ApkBuilder\u003Cbr\u003E________Signing the apk file\u003Cbr\u003E________ZipAligning the apk file\u003Cbr\u003EZIPALIGN time: 0.016 seconds\u003Cbr\u003EBuild finished in 5.719 seconds\u003Cbr\u003E"],0,7]');
      payload.then((node) => {
        expect(node instanceof RpcResult).toEqual(true);
        done();
      });
    });
  });
});

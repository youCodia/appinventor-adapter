import ComponentImportResponse from '../src/rpc/models/ComponentImportResponse';
import {
  importComponentToProject,
} from '../src/rpc/modules/components';

describe('rpc/components', () => {
  beforeEach(() => {
    window.fetch = jest.fn();
  });

  describe('importComponentToProject', () => {
    it('should import component', (done) => {
      // const result = '';
      const res = new Response(`//OK[18,16,17,16,1,0,15,0,14,"RblBAAAAA",0,13,12,0,3,0,11,10,0,3,0,9,8,0,3,0,7,6,0,3,0,5,4,0,3,5,2,0,1,["com.google.appinventor.shared.rpc.component.ComponentImportResponse/707947127","java.util.ArrayList/4159755760","com.google.appinventor.shared.rpc.project.youngandroid.YoungAndroidComponentNode/327788452","assets/external_comps/edu.mit.appinventor.ble/extension.properties","extension.properties","assets/external_comps/edu.mit.appinventor.ble/components.json","components.json","assets/external_comps/edu.mit.appinventor.ble/classes.jar","classes.jar","assets/external_comps/edu.mit.appinventor.ble/files/AndroidRuntime.jar","AndroidRuntime.jar","assets/external_comps/edu.mit.appinventor.ble/files/component_build_infos.json","component_build_infos.json","com.google.appinventor.shared.rpc.component.ComponentImportResponse$Status/1799249089","java.util.TreeMap/1493889780","java.lang.String/2004016611","edu.mit.appinventor.ble.BluetoothLE","BluetoothLE"],0,7]
`, {
        status: 200,
        headers: {
          'Content-type': 'x-gwt-rpc',
        },
      });
      window.fetch.mockReturnValue(Promise.resolve(res));
      importComponentToProject()
        .catch(done)
        .then((componentImportResponse) => {
          expect(componentImportResponse instanceof ComponentImportResponse).toEqual(true);
          done();
        });
    });
  });
});

import { createElement } from 'lwc';
import MyApp from 'my/app';
import '@lwc/synthetic-shadow';

/* Code that launches the top-level lwc. */
const app = createElement('my-app', { is: MyApp });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);

/*
 * This is the place to put ipc receivers that get messages and data from
 * ipcMain, in other words the node process. 
 * Data from the incoming messages can be passed into the lwc infrastructure
 * through @api methods in the main app.
 */

window.electron.receive("fromMain", (data) => {
    console.log(`Received ${data} from main process`);
    app.handleFromMain(data);
});
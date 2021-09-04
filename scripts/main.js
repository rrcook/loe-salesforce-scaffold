// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');

// Additional Tooling.
const path = require('path');
const jsforce = require('jsforce');

const SOQL_QUERY = "Select Id, Name from Account limit 20";

// Electron window
let mainWindow;

// jsforce connection, if logged in
let jfcLoggedIn = false;

// Was there an error when logging in
let jfcError;

// connection info to keep while logged in
let loggedConnection;
let instanceUrl;
let accessToken;
let organizationId;
let userId;


function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'app/preload.js'),
            contextIsolation: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/*
 * This is the location of code where the main process received ipc 
 * communication from the renderer process. 
 */
ipcMain.on('toMain', (event, args) => {
    console.log(`in ToMain, args=${args}`);

    // Send a reply back to the renderer process. 
    mainWindow.webContents.send("fromMain", "pong");
});

ipcMain.on('login', (event, loginData) => {
    console.log(`in login, loginData`);
    console.dir(loginData);

    const conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: loginData.loginURL,
        version: '51.0',
    });

    let { userName, password, securityToken } = loginData;
    if (securityToken !== '') {
        password = `${password}${securityToken}`;
    }

    conn.login(userName, password, (err, userInfo) => {
        // Since we send the loginData back to the interface, it's a good idea
        // to remove the security information.
        loginData.password = '';
        loginData.token = '';

        if (err) {
            console.log(`Error in login. ${err}`);
            jfcLoggedIn = false;
            jfcError = err;

            const data = { errorMessage: err };
            mainWindow.webContents.send("loginError", data);
            return true;
        }
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        instanceUrl = conn.instanceUrl;
        accessToken = conn.accessToken;
        loggedConnection = { instanceUrl, accessToken };
        organizationId = userInfo.organizationId;
        userId = userInfo.id;

        jfcLoggedIn = true;

        console.log(`We logged in, org id is ${organizationId}, access token is ${accessToken}`);

        const successMessage = `We logged in, org id is ${organizationId}`;
        const data = { successMessage };
        mainWindow.webContents.send("loginSuccess", data);

        return true;
    });

});

ipcMain.on('getAccounts', (event, gaData) => {
    // Run a SOQL query against an org.
    const conn = new jsforce.Connection(loggedConnection);
    conn.query(SOQL_QUERY, (err, result) => {
        if (err) {
            console.log(`error in query, ${err}`);
            return true;
        }
        // Send records back to the interface.
        console.log('the query worked, ');
        console.dir(result);

        mainWindow.webContents.send("displayAccounts", result.records);
        return true;
    });

});

# loe-scaffold

This application is a scaffolding for a Lightning Web Component OSS Electron application, plus
logging into Salesforce and querying objects, using [jsforce](https://github.com/jsforce/jsforce).
It is an expansion of what is created with [create-lwc-app](https://github.com/muenzpraeger/create-lwc-app) in ways that I find useful, and I hope you find useful as well. 
The Salesforce/jsforce additions borrowed from [electronForce](https://github.com/acrosman/electronForce). 
That application uses a jQuery-based UI.
If you build on the native platforms you will get native applications; built on Windows 10, macOS Catalina on Intel, and Ubuntu 20.04.

The main additions to what is done with create-lwc-app:
- I added preload-based ipc communication between the renderer process and the main process, and
made a simple example sending information from renderer to main, and from main to renderer.
- I added all the libraries, resources and setup code to use the oss versions of lightning base components and slds, and used a lightning-button in the app to demonstrate. The setup steps came from 
[this article](https://developer.salesforce.com/blogs/2020/12/build-connected-apps-anywhere-using-lightning-base-components).
- I added electron-forge to package the application as a true standalone electron app.

Additions to loe-scaffold:
- I added a login modal dialog using LWC and SLDS techniques. The login attempts are done in the "main" (node.js) part of the application, so connection information and success and error notifications are passed back to the "renderer".
- I added a simple SOQL query to fulfill in main, to display in a lightning-datatable in the renderer.

## How to start?

If building on Ubuntu, and I assume other Debian-based linuxes, first run `sudo apt-get install rpm`. 

To build the project and check compilation run `npm run build` or `npm build:development`.
To run it as an electron app in development, and see your main process console.log statements,
run `npm run start`. When you're ready to make a standalone application run `npm run make`.

The main process source files are in the [`scripts`](./scripts) folder.

The renderer process source files are located in the [`src`](./src) folder. All web components are within the [`src/modules`](./src/modules) folder. The folder hierarchy also represents the naming structure of the web components.

Find more information on the main repo on [GitHub](https://github.com/muenzpraeger/create-lwc-app).

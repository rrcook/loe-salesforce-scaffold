import { LightningElement, api } from 'lwc';

const CLICK_TO_LOGIN = "Click to login";
const LOGGED_IN = "Logged in";

const ACCOUNT_COLUMNS = [
    { label: 'Id', fieldName: 'Id' },
    { label: 'Name', fieldName: 'Name' }
];

export default class App extends LightningElement {
    showLoginDialog = false;

    errorMessage = "";

    connectMessage = CLICK_TO_LOGIN;
    loggedIn = false;

    accountColumns = ACCOUNT_COLUMNS;
    accountData = [];

    userName;
    handleUserNameChange(event) {
        this.userName = event.target.value;
    }

    password;
    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    securityToken;
    handleSecurityTokenChange(event) {
        this.securityToken = event.target.value;
    }

    loginURL = "https://login.salesforce.com";
    handleLoginURLChange(event) {
        this.loginURL = event.target.value;
    }

    handleLoginClick(event) {
        console.log("Ping button clicked.");
        // Send one-arg data to the main node process.
        window.electron.send("toMain", "ping");
        this.openLoginDialog();
    }

    /* "Opening the dialog" just means making the modal dialog visible. */
    openLoginDialog() {
        this.errorMessage = "";
        this.showLoginDialog = true;
    }

    handleLoginCancel() {
        this.errorMessage = "";
        this.showLoginDialog = false;
    }

    handleLoginAttempt() {

        const loginData = {
            userName: this.userName,
            password: this.password,
            securityToken: this.securityToken,
            loginUrl: this.loginURL
        };

        window.electron.send("login", loginData);
    }

    handleGetAccounts() {
        window.electron.send("getAccounts", "");
    }

    // to enable or disable the "Get Accounts" button
    get loginDisabled() {
        return !this.loggedIn;
    }

    /* These methods are invoked from the message receivers in index.js. */

    @api
    handleFromMain(data) {
        // Handle the data that was send back from the main node process,
        // captured in index.js and passed down to app.
        console.log(`In app.js, the data from main is ${data}`);
    }

    // Give user a chance to change settings and try again.
    @api
    handleLoginError(data) {
        this.loggedIn = false;
        console.log(`error message is ${data.errorMessage}`);
        this.errorMessage = data.errorMessage;
    }

    @api
    handleLoginSuccess(data) {
        this.loggedIn = true;
        this.connectMessage = LOGGED_IN;
        this.showLoginDialog = false;
    }

    @api
    handleDisplayAccounts(data) {
        this.accountData = data;
    }
}


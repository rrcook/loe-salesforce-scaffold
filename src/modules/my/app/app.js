import { LightningElement, api } from 'lwc';

export default class App extends LightningElement {
    handleClick(event) {
        console.log("Ping button clicked.");
        // Send one-arg data to the main node process.
        window.electron.send("toMain", "ping",);
    }

    @api
    handleFromMain(data) {
        // Handle the data that was send back from the main node process,
        // captured in index.js and passed down to app.
        console.log(`In app.js, the data from main is ${data}`);
    }

}

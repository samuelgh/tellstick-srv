let flicLib = require('./../lib/flic-lib');
let tellstick = require('tellstick')();

let FlicClient = flicLib.FlicClient;
let FlicConnectionChannel = flicLib.FlicConnectionChannel;

const client = new FlicClient("localhost", 5551);
let devList = {};
tellstick.list((err,devices) => {
    if (err) {
        console.log('Error: ' + err);
    }
    devList = devices;
    console.log('Loaded devList');
});


const listenToButton = (bdAddr) => {
    const cc = new FlicConnectionChannel(bdAddr);
    client.addConnectionChannel(cc);
    cc.on("buttonUpOrDown", (clickType, wasQueued, timeDiff) => {
        console.log(bdAddr + " " + on + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
        if (clickType === 'ButtonDown') {
            devList.forEach((device) => {
                tellstick.turnOff(device.id)
            });
        }
    });
    cc.on("connectionStatusChanged", (connectionStatus, disconnectReason) => {
        console.log(bdAddr + " " + connectionStatus + (connectionStatus == "Disconnected" ? " " + disconnectReason : ""));
    });
};

client.once("ready", function() {
    console.log("Connected to daemon!");
    client.getInfo(function(info) {
        info.bdAddrOfVerifiedButtons.forEach((bdAddr) => {
            listenToButton(bdAddr);
        });
    });
});

client.on("bluetoothControllerStateChange", function(state) {
    console.log("Bluetooth controller state change: " + state);
});

client.on("newVerifiedButton", function(bdAddr) {
    console.log("A new button was added: " + bdAddr);
    listenToButton(bdAddr);
});

client.on("error", function(error) {
    console.log("Daemon connection error: " + error);
});

client.on("close", function(hadError) {
    console.log("Connection to daemon is now closed");
});
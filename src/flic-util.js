const flicLib = require('./../lib/flic-lib');

const FlicClient = flicLib.FlicClient;
const FlicConnectionChannel = flicLib.FlicConnectionChannel;

const client = new FlicClient("localhost", 5551);

function listenToButton(bdAddr) {
    const cc = new FlicConnectionChannel(bdAddr);
    client.addConnectionChannel(cc);
    cc.on("buttonUpOrDown", function(clickType, wasQueued, timeDiff) {
        console.log(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
    });
    cc.on("connectionStatusChanged", function(connectionStatus, disconnectReason) {
        console.log(bdAddr + " " + connectionStatus + (connectionStatus == "Disconnected" ? " " + disconnectReason : ""));
    });
}

client.once("ready", function() {
    console.log("Connected to daemon!");
    client.getInfo(function(info) {
        info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
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
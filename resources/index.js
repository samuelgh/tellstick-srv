console.log("Loading scripts...");


var devices;

function getDevices() {
  var xmlhttp = new XMLHttpRequest();
  var url = "../devices";

  xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var table = document.getElementsByTagName('table')[0];
          var devList = JSON.parse(xmlhttp.responseText);

          devList.forEach((dev) => {
              var row = document.createElement("tr");
              var td = document.createElement("td");
              td.colSpan = '2';
              td.id = dev.id;
              td.innerHTML = dev.name;
              td.className = dev.on ? "" : "off";
              row.appendChild(td);
              table.appendChild(row);
          });
          devices = Array.from(document.getElementsByTagName('td'));
          updateAllBtns();
      }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function updateDevices() {
  var xmlhttp = new XMLHttpRequest();
  var url = "../devices";

  xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var devList = JSON.parse(xmlhttp.responseText);

          devList.forEach((dev) => {
            var item = document.getElementById(dev.id);
            if (item) {
              item.className = dev.on ? "" : "off";
            }
          });
          updateAllBtns();
      }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
getDevices();

function postOn(id) {
  var xmlhttp = new XMLHttpRequest();
  var url = "../on";
  xmlhttp.open("POST", url, true);
  xmlhttp.send(id);
}
function postOff(id) {
  var xmlhttp = new XMLHttpRequest();
  var url = "../off";
  xmlhttp.open("POST", url, true);
  xmlhttp.send(id);
}
function allOffReq() {
  var xmlhttp = new XMLHttpRequest();
  var url = "../alloff";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
function allOnReq() {
  var xmlhttp = new XMLHttpRequest();
  var url = "../allon";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function handleClick(event) {
  if (event.target.nodeName === "TD") {
    event.target.classList.toggle("off");
    if (event.target.classList.contains("off")) {
      postOff(event.target.id);
    } else {
      postOn(event.target.id);
    }
    updateAllBtns();
  }
}

function updateAllBtns() {
  if (document.querySelectorAll("td.off").length > 0) {
    document.getElementById("all-on").classList.remove("off");
  } else {
    document.getElementById("all-on").classList.add("off");
  }
  if(document.querySelectorAll('td:not(.off)').length === 0) {
    document.getElementById("all-off").classList.add("off");
  } else {
    document.getElementById("all-off").classList.remove("off");
  }
}

function allOff(event) {
  devices.forEach((device) => {
    device.classList.add("off");
  });
  document.getElementById("all-off").classList.add("off");
  document.getElementById("all-on").classList.remove("off");
  allOffReq();
}
function allOn(event) {
  devices.forEach((device) => {
    device.classList.remove("off");
  });
  document.getElementById("all-on").classList.add("off");
  document.getElementById("all-off").classList.remove("off");
  allOnReq();
}
document.addEventListener('click',handleClick);
document.getElementById("all-off").onclick = allOff;
document.getElementById("all-on").onclick = allOn;

window.onfocus = function() {
  updateDevices();
}

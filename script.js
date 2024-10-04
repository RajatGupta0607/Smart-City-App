var key = "PI2dkNolrSILpnkj7qQblVjEQ9LBbYkH";

var ic = {
  0: "Unknown",
  1: "Accident",
  2: "Fog",
  3: "Dangerous Conditions",
  4: "Rain",
  5: "Ice",
  6: "Jam",
  7: "Lane Closed",
  8: "Road Closed",
  9: "Road Works",
  10: "Wind",
  11: "Flooding",
  12: "Detour",
  13: "Cluster",
  14: "Broken Down Vehicle",
};

var ty = {
  0: ["Unknown", "rgba(0,0,0,0.25)"],
  1: ["Minor", "rgba(0,153,0,0.25)"],
  2: ["Moderate", "rgba(255,102,0,0.25)"],
  3: ["Major", "rgba(255,0,0,0.25)"],
  4: ["Undefined", "rgba(102,204,255,0.25)"],
};

function makeMap(result) {
  var coor = result["results"][0]["position"];
  var lnglat = [coor["lng"], coor["lat"]];
  const map = tt.map({
    key: key,
    container: "map",
    stylesVisibility: {
      trafficIncidents: true,
      trafficFlow: true,
    },
    center: lnglat, //lng,lat
    zoom: 13,
  });
  getIncidents(map.getBounds());
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const city = urlParams.get("city");
document.getElementById("city-header").innerHTML =
  "Current Traffic Incidents in " + city;
tt.services
  .geocode({
    key: key,
    query: city,
  })
  .then(makeMap);

var xmlhttp = new XMLHttpRequest();

function reqListener() {
  var arr = JSON.parse(this.responseText)["tm"]["poi"];
  var txt = "<tr><th>From</th><th>Description</th><th>Cause</th></tr>";
  arr.forEach(function (obj) {
    var icd = ic[obj["ic"]];
    var tyd = ty[obj["ty"]];
    txt +=
      "<tr style='background-color:" +
      tyd[1] +
      "'><td>" +
      obj["f"] +
      "</td><td>" +
      obj["d"] +
      "</td><td style='width:20%;'>" +
      icd +
      "</td></tr>";
  });
  document.getElementById("tabledata").innerHTML = txt;
}

function getIncidents(bounds) {
  var bounds_arr = [
    bounds["_sw"]["lat"],
    bounds["_sw"]["lng"],
    bounds["_ne"]["lat"],
    bounds["_ne"]["lng"],
  ];

  var query =
    "https://api.tomtom.com/traffic/services/4/incidentDetails/s3/" +
    bounds_arr.join() +
    "/13/-1/json?projection=EPSG4326&key=" +
    key;

  xmlhttp.addEventListener("load", reqListener);
  xmlhttp.open("GET", query, true);
  xmlhttp.send();
}

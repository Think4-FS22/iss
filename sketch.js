let geodata = [];
let countries = [];
let projection;

let img;

let issdata;

// Live position International Space Station ISS
// http://api.open-notify.org/iss-now.json

function preload() {
  geodata = loadJSON("world.geojson");
  issdata = loadJSON("http://api.open-notify.org/iss-now.json");
}

function setup() {
  createCanvas(800, 600);

  projection = d3
    .geoMercator()
    .center([8.227, 46.8181])
    .translate([width / 2, height / 2])
    .scale(300);

  countries = geodata.features;

  console.log(issdata);

  setInterval(fetchIssData, 100);

  noLoop();
}

function draw() {
  background(250);

  // display countries
  for (let i = 0; i < countries.length; i++) {
    let coordinates = countries[i].geometry.coordinates;
    let type = countries[i].geometry.type;

    for (let j = 0; j < coordinates.length; j++) {
      let coordinates2;
      if (type == "Polygon") {
        coordinates2 = coordinates[j];
      } else if (type == "MultiPolygon") {
        coordinates2 = coordinates[j][0];
      }

      fill(255);
      stroke(0);
      beginShape();
      for (let k = 0; k < coordinates2.length; k++) {
        let xy = projection(coordinates2[k]); // [74.88986, 37.23409] -> [634,327]

        vertex(xy[0], xy[1]);
      }
      endShape();
    }
  }

  // draw the iss
  let lat = issdata.iss_position.latitude;
  let lon = issdata.iss_position.longitude;
  console.log(lat, lon);

  let xy = projection([lon, lat]); // [x,y]
  fill(0);
  noStroke();
  textSize(32);
  text("🛰️", xy[0], xy[1]);
  // ellipse(xy[0], xy[1], 20, 20);
}

function fetchIssData() {
  console.log("hello");
  loadJSON("http://api.open-notify.org/iss-now.json", updateIssData);
}

function updateIssData(response) {
  console.log(response);
  issdata = response;

  let lat = issdata.iss_position.latitude;
  let lon = issdata.iss_position.longitude;
  projection.center([lon, lat]);

  redraw();
}


function keyTyped(){
  // zoom in and out
  if(key == 'q'){
    projection.scale(projection.scale() * 1.5);

  }else if(key == 'w'){
    projection.scale(projection.scale() * 0.5);
  }

  redraw();
}

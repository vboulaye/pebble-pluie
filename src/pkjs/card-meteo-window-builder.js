const UI = require('pebblejs/ui');
const Vector2 = require('pebblejs/lib/vector2');
const Feature = require('pebblejs/platform/feature');


UI.Window.prototype.center = function (element, moveVector) {
  var wind = this;
  var windSize = wind.size();
// Center the radial in the window
  var elementPos = element.position()
    .addSelf(windSize)
    .subSelf(element.size())
    .multiplyScalar(0.5);
  if (moveVector) {
    elementPos = elementPos.subSelf(moveVector);
  }
  element.position(elementPos);
  wind.add(element);
  return element;
};

function convertLevelToColor(level) {
  const COLORS = {
    '1': 'white',
    '2': Feature.color('celeste', 'lightGray'),
    '3': Feature.color('pictonBlue', 'darkGray'),
    '4': Feature.color('dukeBlue', 'black'),
    '5': Feature.color('oxfordBlue', 'black'),
  };
  var color = COLORS[level] || 'lightGray';// gray for  undefined
  return color;
}

function createSection(segment, level) {
  var color = convertLevelToColor(level);

  var radial = new UI.Radial({
    size: new Vector2(140, 140),
    angle: segment * 30,
    angle2: (segment + 1) * 30,
    radius: 20,
    backgroundColor: color,
    borderColor: 'darkGray',
    borderWidth: 1,
  });
  return radial;
}

function createCityText(contents) {
  var textfield = new UI.Text({
    size: new Vector2(100, 60),
    font: 'gothic-24-bold',
    text: contents,
    textAlign: 'center',
    //color: 'windsorTan'
  });

  return textfield;
}

function createTimeText(contents) {
  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-24',
    text: contents,
    textAlign: 'center',
    //color: 'windsorTan'
  });

  return textfield;
}

function createStartBar() {
  var radial = new UI.Radial({
    size: new Vector2(140, 140),
    angle: 0,
    angle2: 2,
    radius: 20,
    backgroundColor: 'orange',
    borderColor: 'black',
    borderWidth: 0,
  });
  return radial;
}

function refreshWindow(city, rain) {

  var wind = this;

  //console.log('refreshing ' + city.name + ' with ' + JSON.stringify(rain));
  wind.cityText.text(city.name);

  if (rain) {
    wind.lastUpdateText.text(rain.lastUpdate);
  } else {
    wind.lastUpdateText.text('--:--');
  }
  console.log('refreshing ' + city.name +'  '+ wind.lastUpdateText.text());

  // console.log("sections" , wind.sections);
  if (rain && rain.dataCadran) {
    rain.dataCadran.forEach(function (sectionData, idx) {
      wind.sections[idx].backgroundColor(convertLevelToColor(sectionData.niveauPluie));
      //swind.sections[idx].backgroundColor('#' + sectionData.color);
    });
  } else {
    // create empty circle
    for (var i = 0; i < 12; i++) {
      wind.sections[i].backgroundColor(convertLevelToColor(0));
    }
  }
}

function buildCardMeteoWindow() {
  var wind = new UI.Window({
    backgroundColor: 'black',
    status: {
      color: 'white',
      backgroundColor: 'black',
      separator: 'none',
    },
  });

  const vertPush = Feature.round(12,0);

  //const contents = rain ? city.name + '\n' + rain.lastUpdate : city.name;
  wind.cityText = createCityText('');
  wind.center(wind.cityText, new Vector2(0, 10+vertPush));

  wind.lastUpdateText = createTimeText('');
  wind.center(wind.lastUpdateText, new Vector2(0, -35+vertPush));
  // create empty circle
  wind.sections = [];
  for (var i = 0; i < 12; i++) {
    var element = createSection(i, 0);
    element = wind.center(element, new Vector2(0, +vertPush));
    wind.sections.push(element);
  }
  var radial = createStartBar();
  wind.center(radial, new Vector2(0, +vertPush));

  wind.refreshWindow = refreshWindow;

  return wind;
}

module.exports = buildCardMeteoWindow;

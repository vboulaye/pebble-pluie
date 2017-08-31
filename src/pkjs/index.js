require('pebblejs');

const Clay = require('pebble-clay');
const clayConfig = require('./config.json');
const clay = new Clay(clayConfig);

const UI = require('pebblejs/ui');
const Vector2 = require('pebblejs/lib/vector2');

const getCurrentCity = require('./current-city.js');
const CardMeteo = require('./card-meteo.js');
const CardStack = require('./card-stack.js');

const stack = new CardStack(new UI.Card({banner: 'IMAGE_TILE_SPLASH'}));

var settings = JSON.parse(localStorage.getItem('clay-settings')) || {};

console.log(JSON.stringify(settings));


if (settings.CITY_CURRENT_DISPLAY) {

// Choose options about the data returned
  getCurrentCity(function (city) {
    console.log("city:", JSON.stringify(city));

    // register and show the current location card
    stack.register(new CardMeteo(city), true);

  }, function (err) {
    console.log('location error: ', err);
  });

}

const cityCodes = settings['CITY_CODES'];
if (cityCodes) {
  cityCodes.split(/[ ,;]+/).forEach(function (cityCode) {
    // lookup city
    stack.register(new CardMeteo({inseeCode: cityCode, name: cityCode}));

  })
}
stack.register(new CardMeteo({inseeCode: '94003', name: 'Arcueil'}));
stack.register(new CardMeteo({inseeCode: '91326', name: 'Juvisy'}));

// show the first card initially
stack.show(0);

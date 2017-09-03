require('pebblejs');

const Clay = require('pebble-clay');
const clayConfig = require('./config.json');
const clay = new Clay(clayConfig);

const UI = require('pebblejs/ui');

const getCurrentCity = require('./current-city.js');
const getCityInfo = require('./info-city.js');

const CardMeteo = require('./card-meteo.js');
const CardStack = require('./card-stack.js');

const stack = new CardStack(new UI.Card({banner: 'IMAGE_TILE_SPLASH'}));

const settings = JSON.parse(localStorage.getItem('clay-settings')) || {};

console.log(JSON.stringify(settings));


console.log("setting up CITY_CURRENT_DISPLAY " + settings.CITY_CURRENT_DISPLAY);
if (settings.CITY_CURRENT_DISPLAY) {

// Choose options about the data returned
  getCurrentCity(function (city) {
    console.log("geoloc city:" + JSON.stringify(city));

    // register and show the current location card
    stack.register(new CardMeteo(city), true);

  }, function (err) {
    console.log('location error: ', JSON.stringify(err));
  });

}

const cityCodes = settings.CITY_CODES;
console.log("setting up CITY_CODES " + cityCodes);

const cityCache = JSON.parse(localStorage.getItem('vbo-pluie-city-cache')) || {};
if (cityCache.cityCodes !== cityCodes) {
  cityCache.cityCodes = cityCodes;
  cityCache.cache = {}
}


var cityCodesList;
if (cityCodes) {
  cityCodesList = cityCodes.split(/[,;]+/);
} else {
  //for testing
  cityCodesList = ["94003/Arcueil", "91326/Juvisy"];
}

cityCodesList.forEach(function (cityCode) {
  if (cityCode.indexOf('/') > -1) {
    var cityParts = cityCode.split('/');
    console.log('using preconfigured setup: '+JSON.stringify(cityParts));
    stack.register(new CardMeteo({inseeCode: cityParts[0], name: cityParts[1]}));

  } else if (cityCache.cache[cityCode]) {
    const city = cityCache.cache[cityCode];
    console.log('using cached city: '+JSON.stringify(city));
    stack.register(new CardMeteo({inseeCode: city.inseeCode, name: city.name}));
  } else {
    // lookup city
    console.log('looking up city: '+cityCode);
    getCityInfo(cityCode, function (city) {

      console.log('found city: '+JSON.stringify(city));
      cityCache.cache[cityCode] = city;
      stack.register(new CardMeteo({inseeCode: city.inseeCode, name: city.name}));

      localStorage.setItem('vbo-pluie-city-cache', JSON.stringify(cityCache));
    });

  }

});

// stack.register(new CardMeteo({inseeCode: '94003', name: 'Arcueil'}));
// stack.register(new CardMeteo({inseeCode: '91326', name: 'Juvisy'}));

// show the first card initially
stack.show(0);

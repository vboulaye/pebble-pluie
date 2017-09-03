const UI = require('pebblejs/ui');
const Vector2 = require('pebblejs/lib/vector2');

const getRain = require('./meteo-parser.js');
const buildCardMeteoWindow = require('./card-meteo-window-builder.js');

function CardMeteo(city) {
  if (!city.inseeCode) {
    throw new Error("the city argument must have an inseeCode defined");
  }
  this.city = city;

  this.card = buildCardMeteoWindow();
  this.card.refreshWindow(city);
};

CardMeteo.prototype.getId = function(){
  return this.city.inseeCode;
};

CardMeteo.prototype.refresh = function refresh(onSuccess, onError) {
  const self = this;
  self.card.refreshWindow(self.city);

  getRain(self.city.inseeCode,
    function (rain) {

      self.card.refreshWindow(self.city, rain);

      if (onSuccess) {
        onSuccess(rain);
      }

    }, function (err) {
      console.error('refresh error occured ', err);

      self.card = new UI.Card({
        title: city.name,
        titleColor: 'indigo', // Named colors
        bodyColor: 'red',// Hex colors
        body: err
      });

      if (onError) {
        onError(rain);
      }
    })
};

CardMeteo.prototype.show = function show() {
  const self = this;
  self.card.show();
};


module.exports = CardMeteo;
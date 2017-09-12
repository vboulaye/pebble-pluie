const UI = require('pebblejs/ui');

const getRain = require('./meteo-parser.js');

function InfoMeteo(city) {
  if (!city.inseeCode) {
    throw new Error("the city argument must have an inseeCode defined");
  }
  this.city = city;
  //this.card.refreshWindow(city);
};

InfoMeteo.prototype.getId = function () {
  return this.city.inseeCode;
};

InfoMeteo.prototype.refresh = function refresh(onSuccess, onError) {
  const self = this;

  self.rain = null;

  getRain(self.city.inseeCode,
    function (rain) {
      // refreshCard.hide();
      self.rain = rain;
      if (onSuccess) {
        onSuccess(rain);
      }

    }, function (err) {
      console.error('refresh error occured ', err);
      // refreshCard.hide();

      new UI.Card({
        title: city.name,
        titleColor: 'indigo', // Named colors
        bodyColor: 'red',// Hex colors
        body: err
      }).show();

      if (onError) {
        onError(rain);
      }
    })
};

module.exports = InfoMeteo;
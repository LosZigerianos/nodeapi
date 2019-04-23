const i18n = require('i18n');

i18n.configure({
  locales:['es', 'en'],
  directory: __dirname + '/locales',
  //defaultLocale: 'es',
  queryParameter: 'lang',
  cookie: 'lang'
});


i18n.checkLanguage = (req) => {

  if (req.query.lang) {
    i18n.setLocale(req.query.lang);
    return;
  }

  if (i18n.cookie) {
    i18n.setLocale(i18n.cookie);
    return;
  }

  if (req.headers['accept-language']) {
    i18n.setLocale(req.headers['accept-language']);
    return;
  }

  return;
};

module.exports = i18n;
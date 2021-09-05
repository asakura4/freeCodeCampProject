'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  //const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let text = req.body.text;
      let locale = req.body.locale;

      if(text === undefined || locale === undefined){
        return res.send({
          error: 'Required field(s) missing'
        });
      }else if(text.length == 0){
        return res.send({
          error: 'No text to translate' 
        });        
      }else if(!(locale === 'american-to-british' ||locale === 'british-to-american')){
        return res.send({
          error: 'Invalid value for locale field'
        });
      }
      const translator = new Translator(locale);
      let translation = translator.translate(text);
      if(translation === text){
        return res.send({
          text,
          translation: "Everything looks good to me!"
        });
      }else{
        return res.send({
          text,
          translation
        });
      }

      
    });
};

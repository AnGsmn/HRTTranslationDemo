const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when the action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {

    try {

      // *******TODO**********
      // - Call the language identification API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#identify-language
      // - if successful, resolve exactly like shown below with the
      // language that is most probable the best one in the "language" property
      // and the confidence it got detected in the "confidence" property

      // in case of errors during the call resolve with an error message according to the pattern 
      // found in the catch clause below

      // Create new Language Translator
      const languageTranslator = new LanguageTranslatorV3({
        version: '2021-05-04',
        authenticator: new IamAuthenticator({
          apikey: 'n6bD8lOgC4xf8lTiRckwRrhrpx1cCmizP3dTzkxQG8Pq',
        }),
        serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/62c194d1-535e-4bb5-b333-930387bb70fa',
        disableSslVerification: true,
      });


      // Error Handling
      languageTranslator.method(params)
        .catch(err => {
          console.log('error:', err);
        });

      // Check for supported language
      languageTranslator.listLanguages(params)
        .then(languages => {
          console.log(JSON.stringify(languages, null, 2));
        })
        .catch(err => {
          console.log('error:', err);
        });


      resolve({
        statusCode: 200,
        body: {
          text: params.text,
          language: "<Best Language>",
          confidence: 0.5,
        },
        headers: { 'Content-Type': 'application/json' }
      });


    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}

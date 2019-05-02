/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const fetch = require('node-fetch');
// const API_URL = 'https://api.apixu.com/v1/current.json?key=4d821f44b51e4c9a80525324193004&q=190.211.109.131';
const API_URL = 'http://dataservice.accuweather.com/currentconditions/v1/1179375?apikey=H8Rz4xLevHBv2wOzRx7UqhB0WhltAxRM&details=true'

const SKILL_NAME = 'Santa Clara Weather';
const GET_FACT_MESSAGE = 'The weather in Santa Clara currently is: ';
const HELP_MESSAGE = 'I can tell you the temperature for Santa Clara';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        console.log(data[0].RelativeHumidity);
        
        const speechOutput = GET_FACT_MESSAGE + data[0].Temperature.Metric.Value + ` degrees. Humidity is at ${data[0].RelativeHumidity} percent.`;
        console.log(speechOutput);
      })
      .catch(err => console.log(err));

const GetClimateHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetClimateIntent');
  },
  handle(handlerInput) {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const currentTemp = data.current.temp_c;
        const speechOutput = GET_FACT_MESSAGE + data[0].Temperature.Metric.Value + ` degrees. Humidity is at ${data[0].RelativeHumidity} percent.`;
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .withSimpleCard(SKILL_NAME, currentTemp)
          .getResponse();
      })
      .catch(err => console.log(err));
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetClimateHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
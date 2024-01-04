import { camelizeKeys } from 'humps';

/**
 * Extracts an array of teams from an array of topics.
 *
 * @param {Array} topics - An array of topic objects.
 * @returns {Array} - An array containing all the teams from the topics.
 */
export const getTeamsFromTopics = (topics) => topics.reduce((teams, topic) => teams.concat(topic.teams), []);

/**
 * Converts snake_case keys in an object or an array of objects to camelCase.
 * @param {object | object[]} data - Input object or an array of objects.
 * @returns {object | object[]} - Object or array of objects with keys converted to camelCase.
 */
export const convertSnakeCaseToCamelCase = (object) => camelizeKeys(object);

import { getTeamsFromTopics, convertSnakeCaseToCamelCase } from './utils';

describe('TeamEmail utils', () => {
  describe('getTeamsFromTopics function', () => {
    test('should return an array of teams when given an array of topics', () => {
      const topics = [
        { name: 'Topic 1', teams: ['Team A', 'Team B'] },
        { name: 'Topic 2', teams: ['Team C', 'Team D'] },
      ];

      const result = getTeamsFromTopics(topics);

      expect(result).toEqual(['Team A', 'Team B', 'Team C', 'Team D']);
    });

    test('should return an empty array when given an empty array of topics', () => {
      const topics = [];

      const result = getTeamsFromTopics(topics);

      expect(result).toEqual([]);
    });

    test('should return an empty array when no teams are present in the topics', () => {
      const topics = [
        { name: 'Topic 1', teams: [] },
        { name: 'Topic 2', teams: [] },
      ];

      const result = getTeamsFromTopics(topics);

      expect(result).toEqual([]);
    });
  });
  describe('convertSnakeCaseToCamelCase function', () => {
    test('should convert snake_case keys in a single object to camelCase', () => {
      const snakeCaseObj = {
        first_name: 'John',
        last_name: 'Doe',
        age_group: '30-40',
      };

      const camelCaseObj = convertSnakeCaseToCamelCase(snakeCaseObj);

      expect(camelCaseObj).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        ageGroup: '30-40',
      });
    });

    test('should convert snake_case keys in an array of objects to camelCase', () => {
      const snakeCaseArray = [
        {
          first_name: 'Alice',
          last_name: 'Smith',
          age_group: '20-30',
        },
        {
          first_name: 'Bob',
          last_name: 'Johnson',
          age_group: '40-50',
        },
      ];

      const camelCaseArray = convertSnakeCaseToCamelCase(snakeCaseArray);

      expect(camelCaseArray).toEqual([
        {
          firstName: 'Alice',
          lastName: 'Smith',
          ageGroup: '20-30',
        },
        {
          firstName: 'Bob',
          lastName: 'Johnson',
          ageGroup: '40-50',
        },
      ]);
    });

    test('should not convert snake_case keys null case', () => {
      const camelCaseArray = convertSnakeCaseToCamelCase(null);

      expect(camelCaseArray).toEqual(null);
    });

    test('should not convert snake_case keys empty case', () => {
      const camelCaseArray = convertSnakeCaseToCamelCase('');

      expect(camelCaseArray).toEqual('');
    });
  });
});

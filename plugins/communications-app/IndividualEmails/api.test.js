import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import { getLearnersEmailInstructorTask } from './api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('getLearnersEmailInstructorTask', () => {
  const mockCourseId = 'course123';
  const mockSearch = 'testuser';
  const mockResponseData = { data: 'someData' };
  const mockConfig = { LMS_BASE_URL: 'http://localhost' };

  beforeEach(() => {
    getConfig.mockReturnValue(mockConfig);
    getAuthenticatedHttpClient.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponseData),
    });
  });

  test('successfully fetches data', async () => {
    const data = await getLearnersEmailInstructorTask(mockCourseId, mockSearch);
    expect(data).toEqual(mockResponseData);
    expect(getAuthenticatedHttpClient().get).toHaveBeenCalledWith(
      `http://localhost/platform-plugin-communications/${mockCourseId}/api/search_learners?query=${mockSearch}&page=1&page_size=10`,
    );
  });

  test('handles an error', async () => {
    getAuthenticatedHttpClient().get.mockRejectedValue(new Error('Network error'));

    await expect(getLearnersEmailInstructorTask(mockCourseId, mockSearch)).rejects.toThrow('Network error');
    expect(logError).toHaveBeenCalledWith(new Error('Network error'));
  });
});

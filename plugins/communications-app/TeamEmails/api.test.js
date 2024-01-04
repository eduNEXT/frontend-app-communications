import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import { getTeamsList } from './api';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('getTeamsList function', () => {
  const mockCourseId = 'course123';
  const mockResponseData = { data: 'someData' };
  const mockConfig = { LMS_BASE_URL: 'http://localhost' };

  beforeEach(() => {
    getConfig.mockReturnValue(mockConfig);
    getAuthenticatedHttpClient.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponseData),
    });
  });

  test('successfully fetches teams list with default parameters', async () => {
    const response = await getTeamsList(mockCourseId);

    expect(response).toEqual(mockResponseData);
    expect(getAuthenticatedHttpClient().get).toHaveBeenCalledWith(
      `http://localhost/platform-plugin-teams/${mockCourseId}/api/topics/?page=1&pageSize=100`,
    );
  });

  test('successfully fetches teams list with custom page and pageSize', async () => {
    const customPage = 2;
    const customPageSize = 50;

    const response = await getTeamsList(mockCourseId, customPage, customPageSize);

    expect(response).toEqual(mockResponseData);
    expect(getAuthenticatedHttpClient().get).toHaveBeenCalledWith(
      `http://localhost/platform-plugin-teams/${mockCourseId}/api/topics/?page=${customPage}&pageSize=${customPageSize}`,
    );
  });

  test('handles an error', async () => {
    const errorMessage = 'Network error';
    getAuthenticatedHttpClient().get.mockRejectedValue(new Error(errorMessage));

    await expect(getTeamsList(mockCourseId)).rejects.toThrow(errorMessage);
  });
});

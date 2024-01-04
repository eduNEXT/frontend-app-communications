import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export async function getTeamsList(courseId, page = 1, pageSize = 100) {
  const endpointUrl = `${
    getConfig().LMS_BASE_URL
  }/platform-plugin-teams/${courseId}/api/topics/?page=${page}&pageSize=${pageSize}`;
  try {
    const response = await getAuthenticatedHttpClient().get(endpointUrl);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

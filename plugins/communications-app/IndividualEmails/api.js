import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

export async function getLearnersEmailInstructorTask(courseId, search) {
  const endpointUrl = `${getConfig().LMS_BASE_URL}/platform-plugin-communications/${courseId}/api/search_learners?query=${search}&page=1&page_size=10`;
  try {
    const response = await getAuthenticatedHttpClient().get(endpointUrl);
    return response;
  } catch (error) {
    logError(error);
    throw new Error(error);
  }
}

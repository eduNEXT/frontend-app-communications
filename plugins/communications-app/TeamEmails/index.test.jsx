import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from '@communications-app/src/components/bulk-email-tool/bulk-email-form/BuildEmailFormExtensible/context';

import * as api from './api';
import messages from './messages';
import TeamEmails from '.';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock(
  '@communications-app/src/components/bulk-email-tool/bulk-email-form/BuildEmailFormExtensible/context',
  () => ({
    ...jest.requireActual(
      '@communications-app/src/components/bulk-email-tool/bulk-email-form/BuildEmailFormExtensible/context',
    ),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  }),
);

jest.mock('./api');
describe('TeamEmails Component', () => {
  const mockData = {
    results: [
      {
        description: 'Placeholder description for the first topic',
        name: 'First Placeholder Topic',
        id: 'topic-1-placeholder-id',
        type: 'open',
        max_team_size: 10,
        teams: [
          {
            id: 'team-1-placeholder-id',
            discussion_topic_id: 'topic-1-placeholder-id',
            name: 'Team 1 Placeholder',
            course_id: 'course-placeholder-id',
            topic_id: 'topic-1-placeholder-id',
            date_created: '2024-01-02T23:21:16.321434Z',
            description: 'Placeholder description for Team 1',
            country: 'US',
            language: 'en',
            last_activity_at: '2024-01-02T23:20:13Z',
            membership: [],
            organization_protected: false,
          },
          {
            id: 'team-2-placeholder-id',
            discussion_topic_id: 'topic-1-placeholder-id',
            name: 'Team 2 Placeholder',
            course_id: 'course-placeholder-id',
            topic_id: 'topic-1-placeholder-id',
            date_created: '2024-01-03T15:21:16.664826Z',
            description: 'Placeholder description for Team 2',
            country: 'UK',
            language: 'en',
            last_activity_at: '2024-01-03T15:19:42Z',
            membership: [],
            organization_protected: false,
          },
        ],
        team_count: 2,
      },
      {
        description: 'Placeholder description for the second topic',
        name: 'Second Placeholder Topic',
        id: 'topic-2-placeholder-id',
        type: 'open',
        max_team_size: 10,
        teams: [
          {
            id: 'team-3-placeholder-id',
            discussion_topic_id: 'topic-2-placeholder-id',
            name: 'Team 3 Placeholder',
            course_id: 'course-placeholder-id',
            topic_id: 'topic-2-placeholder-id',
            date_created: '2024-01-03T15:23:56.065029Z',
            description: 'Placeholder description for Team 3',
            country: 'CA',
            language: 'fr',
            last_activity_at: '2024-01-03T15:22:26Z',
            membership: [],
            organization_protected: false,
          },
        ],
        team_count: 1,
      },
    ],
  };

  const mockTeamsList = [
    {
      id: 'team-1-placeholder-id',
      discussionTopicId: 'topic-1-placeholder-id',
      name: 'Team 1 Placeholder',
      courseId: 'course-placeholder-id',
      topicId: 'topic-1-placeholder-id',
      dateCreated: '2024-01-02T23:21:16.321434Z',
      description: 'Placeholder description for Team 1',
      country: 'US',
      language: 'en',
      lastActivityAt: '2024-01-02T23:20:13Z',
      membership: [],
      organizationProtected: false,
    },
    {
      id: 'team-2-placeholder-id',
      discussionTopicId: 'topic-1-placeholder-id',
      name: 'Team 2 Placeholder',
      courseId: 'course-placeholder-id',
      topicId: 'topic-1-placeholder-id',
      dateCreated: '2024-01-03T15:21:16.664826Z',
      description: 'Placeholder description for Team 2',
      country: 'UK',
      language: 'en',
      lastActivityAt: '2024-01-03T15:19:42Z',
      membership: [],
      organizationProtected: false,
    },
    {
      id: 'team-3-placeholder-id',
      discussionTopicId: 'topic-2-placeholder-id',
      name: 'Team 3 Placeholder',
      courseId: 'course-placeholder-id',
      topicId: 'topic-2-placeholder-id',
      dateCreated: '2024-01-03T15:23:56.065029Z',
      description: 'Placeholder description for Team 3',
      country: 'CA',
      language: 'fr',
      lastActivityAt: '2024-01-03T15:22:26Z',
      membership: [],
      organizationProtected: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    api.getTeamsList.mockResolvedValue({ data: mockData });
    useSelector.mockImplementation((selectorFn) => selectorFn({
      form: {
        teamsList: [],
        emailRecipients: [],
        teamsListFullData: mockTeamsList,
        formStatus: 'default',
      },
    }));
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  // eslint-disable-next-line react/prop-types
  const IntlProviderWrapper = ({ children }) => (
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  );

  test('renders the component without errors', async () => {
    api.getTeamsList.mockResolvedValue({ data: mockData });

    render(
      <IntlProviderWrapper>
        <TeamEmails courseId="course-placeholder-id" />
      </IntlProviderWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(messages.teamEmailsTitle.defaultMessage)).toBeInTheDocument();
      const checkboxes = mockTeamsList.map(({ id }) => screen.getByTestId(`team:${id}`));
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeVisible();
        expect(checkbox).toHaveAttribute('type', 'checkbox');
      });
    });
  });

  test('renders null when teams are empty', async () => {
    api.getTeamsList.mockResolvedValue({ data: { results: [] } });
    render(
      <IntlProviderWrapper>
        <TeamEmails courseId="course-placeholder-id" />
      </IntlProviderWrapper>,
    );

    await waitFor(() => {
      const titleTeams = screen.queryByText(messages.teamEmailsTitle.defaultMessage);
      expect(titleTeams).toBeNull();
    });
  });

  test('handles checkbox change', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    api.getTeamsList.mockResolvedValue({ data: mockData });

    render(
      <IntlProviderWrapper>
        <TeamEmails courseId="course-placeholder-id" />
      </IntlProviderWrapper>,
    );

    await waitFor(() => {
      const checkbox = screen.getByTestId(`team:${mockTeamsList[0].id}`);
      fireEvent.click(checkbox, { target: { checked: true } });
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test('handles error when api.getTeamsList fails', async () => {
    const mockedError = new Error('API Failed');
    api.getTeamsList.mockRejectedValue(mockedError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <IntlProviderWrapper>
        <TeamEmails courseId="course-placeholder-id" />
      </IntlProviderWrapper>,
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('there was an error while getting teams', mockedError.messages);
    });

    consoleSpy.mockRestore();
  });
});

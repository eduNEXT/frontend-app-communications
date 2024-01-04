import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import ListTeams from './ListTeams';

describe('ListTeams component', () => {
  // eslint-disable-next-line react/prop-types
  const IntlProviderWrapper = ({ children }) => (
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  );
  const teamsData = [
    {
      id: '1',
      discussionTopicId: 'topic1',
      name: 'Team 1',
      courseId: 'course1',
      topicId: 'topic1',
      dateCreated: '2024-01-02T23:21:16.321434Z',
      description: 'Description 1',
      country: '',
      language: '',
      lastActivityAt: '2024-01-02T23:20:13Z',
      membership: [],
      organizationProtected: false,
    },
  ];

  test('renders checkboxes for each team', () => {
    const { getAllByTestId } = render(
      <IntlProviderWrapper>
        <ListTeams teams={teamsData} />
      </IntlProviderWrapper>,
    );
    const teamCheckboxes = getAllByTestId(/team:/i);
    expect(teamCheckboxes).toHaveLength(teamsData.length);
  });

  test('displays team names in checkboxes', () => {
    const { getByText } = render(
      <IntlProviderWrapper>
        <ListTeams teams={teamsData} />
      </IntlProviderWrapper>,
    );
    teamsData.forEach(({ name }) => {
      const teamNameElement = getByText(name);
      expect(teamNameElement).toBeInTheDocument();
    });
  });

  test('renders no checkboxes when teams array is empty', () => {
    const { queryByTestId } = render(<ListTeams teams={[]} />);
    const teamCheckboxes = queryByTestId(/team:/i);
    expect(teamCheckboxes).toBeNull();
  });

  test('calls onChangeCheckBox function when a checkbox is clicked', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <IntlProviderWrapper>
        <ListTeams teams={teamsData} onChangeCheckBox={onChangeMock} />
      </IntlProviderWrapper>,
    );

    const checkbox = getByTestId('team:1');
    fireEvent.click(checkbox);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('renders checkboxes with checked status for selected teams', () => {
    const selectedTeams = ['1'];
    const { getByTestId } = render(
      <IntlProviderWrapper>
        <ListTeams teams={teamsData} teamsSelected={selectedTeams} />
      </IntlProviderWrapper>,
    );

    const checkbox = getByTestId('team:1');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });
});

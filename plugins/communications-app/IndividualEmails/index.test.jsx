import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import IndividualEmails from '.';
import * as api from './api';
import messages from './messages';

jest.mock('./api');
describe('IndividualEmails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getLearnersEmailInstructorTask.mockResolvedValue({
      data: {
        results: [
          { email: 'test@email.com', username: 'test', name: 'test' },
          { email: 'test2@email.com', username: 'test2', name: 'test2' },
        ],
      },
    });
  });

  const mockEmailList = [
    { id: '1', email: 'user1@example.com' },
    { id: '2', email: 'user2@example.com' },
  ];

  // eslint-disable-next-line react/prop-types
  const IntlProviderWrapper = ({ children }) => (
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  );

  test('renders the component without errors', () => {
    render(
      <IntlProviderWrapper>
        <IndividualEmails />
      </IntlProviderWrapper>,
    );
  });

  test('displays the correct internationalized messages', () => {
    render(
      <IntlProviderWrapper>
        <IndividualEmails emailList={mockEmailList} />
      </IntlProviderWrapper>,
    );

    const emailInput = screen.getByRole('combobox');

    const {
      individualEmailsLabelLearnersInputLabel,
      individualEmailsLabelLearnersInputPlaceholder,
      individualEmailsLabelLearnersListLabel,
    } = messages;

    expect(screen.getByTestId('learners-email-input-label')).toHaveTextContent(individualEmailsLabelLearnersInputLabel.defaultMessage);
    expect(emailInput).toHaveAttribute('placeholder', individualEmailsLabelLearnersInputPlaceholder.defaultMessage);
    expect(screen.getByTestId('learners-email-list-label')).toHaveTextContent(individualEmailsLabelLearnersListLabel.defaultMessage);
  });

  test('renders the component with main components ', () => {
    render(
      <IntlProviderWrapper>
        <IndividualEmails courseId="123" emailList={mockEmailList} />
      </IntlProviderWrapper>,
    );

    const emailInputLabel = screen.getByTestId('learners-email-input-label');
    const emailInput = screen.getByRole('combobox');
    const emailListLabel = screen.getByTestId('learners-email-list-label');

    expect(emailInputLabel).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(emailListLabel).toBeInTheDocument();
  });

  test('should render two email chips', () => {
    render(
      <IntlProviderWrapper>
        <IndividualEmails courseId="123" emailList={mockEmailList} />
      </IntlProviderWrapper>,
    );

    const emailChips = screen.getAllByTestId('email-list-chip');
    expect(emailChips).toHaveLength(2);
  });

  test('triggers search on typing in search box', async () => {
    const mockHandleEmailSelected = jest.fn();
    const mockCourseId = 'course123';
    render(
      <IntlProviderWrapper>
        <IndividualEmails courseId={mockCourseId} emailList={[]} handleEmailSelected={mockHandleEmailSelected} />
      </IntlProviderWrapper>,
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'test' } });
    await waitFor(() => {
      expect(api.getLearnersEmailInstructorTask).toHaveBeenCalled();
      expect(api.getLearnersEmailInstructorTask).toHaveBeenCalledWith(mockCourseId, 'test');
      const learnersToSelect = screen.getAllByTestId('autocomplete-email-option');
      expect(learnersToSelect).toHaveLength(2);

      const [firstOption] = learnersToSelect;
      fireEvent.click(firstOption);
      expect(mockHandleEmailSelected).toHaveBeenCalled();
    });
  });

  test('invokes handleDeleteEmail when clicking on delete icons', () => {
    const mockHandleDeleteEmail = jest.fn();
    render(
      <IntlProviderWrapper>
        <IndividualEmails courseId="123" emailList={mockEmailList} handleDeleteEmail={mockHandleDeleteEmail} />
      </IntlProviderWrapper>,
    );

    const emailChips = screen.getAllByTestId('email-list-chip');

    emailChips.forEach((chip) => {
      const deleteButton = chip.querySelector('[role="button"]');
      fireEvent.click(deleteButton);
    });

    expect(mockHandleDeleteEmail).toHaveBeenCalledTimes(mockEmailList.length);

    expect(mockHandleDeleteEmail).toHaveBeenCalledWith(mockEmailList[0].id);
    expect(mockHandleDeleteEmail).toHaveBeenCalledWith(mockEmailList[1].id);
  });
});

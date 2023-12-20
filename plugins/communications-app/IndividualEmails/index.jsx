import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { v4 as uuidv4 } from 'uuid';
import {
  Form,
  Chip,
  Container,
} from '@edx/paragon';
import { Person, Close } from '@edx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import { getLearnersEmailInstructorTask } from './api';
import messages from './messages';

import './styles.scss';

const IndividualEmails = ({
  courseId,
  handleEmailSelected,
  emailList,
  handleDeleteEmail,
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue] = useState([]);

  const handleSearchEmailLearners = async (userEmail) => {
    setIsLoading(true);
    try {
      const response = await getLearnersEmailInstructorTask(courseId, userEmail);
      const { results } = response.data;
      const formatResult = results.map((item) => ({ id: uuidv4(), ...item }));
      setOptions(formatResult);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBy = (option) => option.name || option.email || option.username;
  const handleDeleteEmailSelected = (id) => {
    if (handleDeleteEmail) {
      handleDeleteEmail(id);
    }
  };

  const handleSelectedLearnerEmail = (selected) => {
    const [itemSelected] = selected || [{ email: '' }];
    const isEmailAdded = emailList.some((item) => item.email === itemSelected.email);

    if (selected && !isEmailAdded) {
      handleEmailSelected(selected);
    }
  };

  return (
    <Container className="col-12 my-5">
      <Form.Label className="mt-3" data-testid="learners-email-input-label">{intl.formatMessage(messages.individualEmailsLabelLearnersInputLabel)}</Form.Label>
      <AsyncTypeahead
        filterBy={filterBy}
        id="async-autocompleinput"
        isLoading={isLoading}
        labelKey="username"
        minLength={3}
        onSearch={handleSearchEmailLearners}
        options={options}
        name="studentEmail"
        selected={inputValue}
        data-testid="input-typeahead"
        placeholder={intl.formatMessage(messages.individualEmailsLabelLearnersInputPlaceholder)}
        onChange={handleSelectedLearnerEmail}
        renderMenuItemChildren={({ name, email, username }) => (
          <span data-testid="autocomplete-email-option">{name ? `${name} -` : name} {username ? `${username} -` : username} {email}</span>
        )}
      />
      {emailList.length > 0 && (
      <Container className="email-list">
        <Form.Label className="col-12" data-testid="learners-email-list-label">{intl.formatMessage(messages.individualEmailsLabelLearnersListLabel)}</Form.Label>
        {emailList.map(({ id, email }) => (
          <Chip
            variant="light"
            className="email-chip"
            iconBefore={Person}
            iconAfter={Close}
            onIconAfterClick={() => handleDeleteEmailSelected(id)}
            key={id}
            data-testid="email-list-chip"
          >
            {email}
          </Chip>
        ))}
      </Container>
      ) }

    </Container>
  );
};

IndividualEmails.defaultProps = {
  courseId: '',
  handleEmailSelected: () => {},
  handleDeleteEmail: () => {},
  emailList: [],
};

IndividualEmails.propTypes = {
  courseId: PropTypes.string,
  handleEmailSelected: PropTypes.func,
  handleDeleteEmail: PropTypes.func,
  emailList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      username: PropTypes.string,
    }),
  ),
};

export default IndividualEmails;

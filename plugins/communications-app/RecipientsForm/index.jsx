import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Form } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { useSelector, useDispatch } from '@communications-app/src/components/bulk-email-tool/bulk-email-form/BuildEmailFormExtensible/context';
import { actionCreators as formActions } from '@communications-app/src/components/bulk-email-tool/bulk-email-form/BuildEmailFormExtensible/context/reducer';
import PluggableComponent from '@communications-app/src/components/PluggableComponent';
import { BulkEmailContext } from '@communications-app/src/components/bulk-email-tool/bulk-email-context';

import './styles.scss';

const disableIsHasLearners = ['track', 'cohort', 'individual-learners'];
const recipientsFormDescription = 'A selectable choice from a list of potential email recipients';

const RecipientsForm = ({ cohorts: additionalCohorts, courseId }) => {
  const formData = useSelector((state) => state.form);
  const [{ editor }] = useContext(BulkEmailContext);
  const dispatch = useDispatch();
  const {
    isEditMode,
    emailRecipients,
    isFormSubmitted,
    emailLearnersList = [],
    teamsList = [],
  } = formData;

  const [selectedGroups, setSelectedGroups] = useState([]);
  const hasAllLearnersSelected = selectedGroups.some((group) => group === 'learners');

  const handleChangeCheckBoxes = ({ target: { value, checked } }) => {
    let newValue;
    let newEmailLearnersList = emailLearnersList;

    if (checked) {
      const uniqueSet = new Set([...emailRecipients, value]);
      newValue = Array.from(uniqueSet);
    } else {
      newValue = emailRecipients.filter((item) => item !== value);
    }

    if (checked && value === 'learners') {
      newValue = newValue.filter(item => !disableIsHasLearners.some(disabled => item.includes(disabled)));
      newEmailLearnersList = [];
    }

    dispatch(formActions.updateForm({ emailRecipients: newValue, emailLearnersList: newEmailLearnersList }));
    setSelectedGroups(newValue);
  };

  // When the user selects an email from input autocomplete list
  const handleEmailLearnersSelected = (emailSelected) => {
    const [firstItem] = emailSelected;
    if (firstItem) {
      dispatch(formActions.updateForm({ emailLearnersList: [...emailLearnersList, firstItem] }));
    }
  };

  // To delete an email from learners list, that list is on the bottom of the input autocomplete
  const handleLearnersDeleteEmail = (idToDelete) => {
    const setEmailLearnersListUpdated = emailLearnersList.filter(({ id }) => id !== idToDelete);
    dispatch(formActions.updateForm({ emailLearnersList: setEmailLearnersListUpdated }));
  };

  const isInvalidRecipients = teamsList.length === 0 && selectedGroups.length === 0;

  useEffect(() => {
    setSelectedGroups(emailRecipients);
  }, [isEditMode, emailRecipients.length, emailRecipients]);

  useDeepCompareEffect(() => {
    if (!editor.editMode) {
      const newSubjectValue = editor.emailSubject;
      const newBodyValue = editor.emailBody;
      dispatch(formActions.updateForm({
        subject: newSubjectValue,
        body: newBodyValue,
      }));
    }
  }, [editor, dispatch]);

  return (
    <Form.Group>
      <Form.Label>
        <span className="h3 text-primary-500">
          <FormattedMessage
            id="bulk.email.form.recipients.sendLabel"
            defaultMessage="Send to"
            description="A label before the list of potential recipients"
          />
        </span>
      </Form.Label>
      <Form.CheckboxSet
        name="recipientGroups"
        className="flex-wrap flex-row recipient-groups w-100"
        onChange={handleChangeCheckBoxes}
        value={selectedGroups}
      >
        <Form.Checkbox
          key="myself"
          value="myself"
          className="mt-2.5 col col-lg-4 col-sm-6 col-12"
        >
          <FormattedMessage
            id="bulk.email.form.recipients.myself"
            defaultMessage="Myself"
            description={recipientsFormDescription}
          />
        </Form.Checkbox>
        <Form.Checkbox
          key="staff"
          value="staff"
          className="col col-lg-4 col-sm-6 col-12"
        >
          <FormattedMessage
            id="bulk.email.form.recipients.staff"
            defaultMessage="Staff/Administrators"
            description={recipientsFormDescription}
          />
        </Form.Checkbox>
        <Form.Checkbox
          key="track:verified"
          value="track:verified"
          disabled={hasAllLearnersSelected}
          className="col col-lg-4 col-sm-6 col-12"
        >
          <FormattedMessage
            id="bulk.email.form.recipients.verified"
            defaultMessage="Learners in the verified certificate track"
            description={recipientsFormDescription}
          />
        </Form.Checkbox>
        {
            // additional cohorts
            additionalCohorts
            && additionalCohorts.map((cohort) => (
              <Form.Checkbox
                key={cohort}
                value={`cohort:${cohort}`}
                disabled={hasAllLearnersSelected}
                className="col col-lg-4 col-sm-6 col-12"
              >
                <FormattedMessage
                  id="bulk.email.form.cohort.label"
                  defaultMessage="Cohort: {cohort}"
                  values={{ cohort }}
                />
              </Form.Checkbox>
            ))
          }
        <Form.Checkbox
          key="track:audit"
          value="track:audit"
          disabled={hasAllLearnersSelected}
          className="col col-lg-4 col-sm-6 col-12"
        >
          <FormattedMessage
            id="bulk.email.form.recipients.audit"
            defaultMessage="Learners in the audit track"
            description={recipientsFormDescription}
          />
        </Form.Checkbox>
        <Form.Checkbox
          key="learners"
          value="learners"
          className="col col-lg-4 col-sm-6 col-12"
        >
          <FormattedMessage
            id="bulk.email.form.recipients.learners"
            defaultMessage="All Learners"
            description={recipientsFormDescription}
          />
        </Form.Checkbox>

        <Form.Checkbox
          key="individual-learners"
          value="individual-learners"
          className="col col-lg-4 col-sm-6 col-12"
          disabled={hasAllLearnersSelected}
        >
          <FormattedMessage
            id="bulk.email.form.recipients.individual_learners"
            defaultMessage="Individual learners"
            description="A selectable choice from a list of potential to add an email list of learners"
          />
        </Form.Checkbox>
      </Form.CheckboxSet>

      {selectedGroups.includes('individual-learners') && (
      <PluggableComponent
        id="individual-learners"
        as="communications-app-individual-emails"
        courseId={courseId}
        handleEmailSelected={handleEmailLearnersSelected}
        emailList={emailLearnersList}
        handleDeleteEmail={handleLearnersDeleteEmail}
      />
      )}

      <PluggableComponent
        id="team-emails"
        as="communications-app-team-emails"
        courseId={courseId}
      />

      { isFormSubmitted && isInvalidRecipients && (
        <Form.Control.Feedback
          className="px-3"
          type="invalid"
          hasIcon
        >
          <FormattedMessage
            id="bulk.email.form.recipients.error"
            defaultMessage="At least one recipient is required"
            description="An Error message located under the recipients list. Visible only on failure"
          />
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

RecipientsForm.defaultProps = {
  cohorts: [],
  courseId: '',
};

RecipientsForm.propTypes = {
  cohorts: PropTypes.arrayOf(PropTypes.string),
  courseId: PropTypes.string,
};

export default RecipientsForm;

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  useSelector,
  useDispatch,
} from '@communications-app/src/components/bulk-email-tool/bulk-email-form/BuildEmailFormExtensible/context';
import { actionCreators as formActions } from '@communications-app/src/components/bulk-email-tool/bulk-email-form/BuildEmailFormExtensible/context/reducer';

import ListTeams from './ListTeams';
import messages from './messages';
import { getTopicsList } from './api';
import { getTeamsFromTopics, convertSnakeCaseToCamelCase } from './utils';

const TeamEmails = ({ courseId }) => {
  const intl = useIntl();
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();
  const {
    teamsList = [],
    emailRecipients,
    teamsListFullData = [],
    formStatus,
  } = formData;
  const [teams, setTeams] = useState([]);
  const [checkedTeams, setCheckedTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const previousFormStatusRef = useRef(null);

  const fetchTeams = async (page = 1) => {
    try {
      setLoadingTeams(true);
      const responseTopics = await getTopicsList(courseId, page);
      const { results, next } = responseTopics.data;

      const camelCaseResult = convertSnakeCaseToCamelCase(results);
      const formatResult = getTeamsFromTopics(camelCaseResult);

      setTeams((prevTeams) => [...prevTeams, ...formatResult]);

      if (next) {
        fetchTeams(page + 1);
      } else {
        dispatch(formActions.updateForm({ formStatus: 'default' }));
      }
    } catch (error) {
      console.error('There was an error while getting teams:', error.message);
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (loadingTeams) {
      dispatch(formActions.updateForm({ formStatus: 'loadingTeams' }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formStatus, loadingTeams]);

  useEffect(() => {
    if (teams.length) {
      dispatch(formActions.updateForm({ teamsListFullData: teams }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams.length]);

  useEffect(() => {
    const wasFormSubmittedSuccessfully = previousFormStatusRef.current === 'complete' && formStatus === 'default';
    if (wasFormSubmittedSuccessfully) {
      setCheckedTeams([]);
    }

    previousFormStatusRef.current = formStatus;
  }, [formStatus]);

  const handleChangeTeamCheckBox = ({ target: { value, checked } }) => {
    let newTeamsList;
    let newEmailRecipients;
    let newCheckBoxesSelected;
    const teamData = teamsListFullData.find(({ id }) => id === value);
    const teamName = teamData.name;

    if (checked) {
      const uniqueEmailRecipients = new Set([...emailRecipients, teamName]);
      newTeamsList = [...teamsList, value];
      newEmailRecipients = Array.from(uniqueEmailRecipients);
      newCheckBoxesSelected = [...checkedTeams, value];
    } else {
      newTeamsList = teamsList.filter((teamId) => teamId !== value);
      newEmailRecipients = emailRecipients.filter((recipient) => recipient !== teamName);
      newCheckBoxesSelected = checkedTeams.filter((teamId) => teamId !== value);
    }
    dispatch(formActions.updateForm({ teamsList: newTeamsList, emailRecipients: newEmailRecipients }));
    setCheckedTeams(newCheckBoxesSelected);
  };

  if (!teams.length) {
    return null;
  }

  return (
    <div className="p-3 mt-5 rounded border border-light-300">
      <p className="h4 mt-1 mb-3">{intl.formatMessage(messages.teamEmailsTitle)}</p>
      <ListTeams
        teams={teams}
        teamsSelected={checkedTeams}
        onChangeCheckBox={handleChangeTeamCheckBox}
      />
    </div>
  );
};

TeamEmails.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default TeamEmails;

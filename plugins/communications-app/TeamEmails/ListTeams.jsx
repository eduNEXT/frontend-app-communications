import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import './ListTeams.scss';

const recipientsTeamFormDescription = 'A selectable choice from a list of potential email team recipients';

const ListTeams = ({ teams, onChangeCheckBox, teamsSelected }) => (
  <div className="flex-wrap flex-row w-100">
    {teams.map(({ id, name }) => (
      <Form.Checkbox
        key={`team:${name}_${id}`}
        value={id}
        className="mr-4 mb-4 team-checkbox"
        data-testid={`team:${id}`}
        onChange={onChangeCheckBox}
        checked={teamsSelected.includes(id)}
      >
        <FormattedMessage
          id={`bulk.email.form.recipients.teams.${name}`}
          defaultMessage={name}
          description={recipientsTeamFormDescription}
        />
      </Form.Checkbox>
    ))}
  </div>
);

ListTeams.defaultProps = {
  onChangeCheckBox: () => {},
  teamsSelected: [],
};

ListTeams.propTypes = {
  onChangeCheckBox: PropTypes.func,
  teamsSelected: PropTypes.arrayOf(PropTypes.string),
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      discussionTopicId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      courseId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
      dateCreated: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
      lastActivityAt: PropTypes.string.isRequired,
      membership: PropTypes.arrayOf(PropTypes.shape()),
      organizationProtected: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default ListTeams;

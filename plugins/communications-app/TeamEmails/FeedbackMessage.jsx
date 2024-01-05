import PropTypes from 'prop-types';
import {
  Form,
  Spinner,
} from '@edx/paragon';

import './FeedbackMessage.scss';

const FeedbackMessage = ({ title }) => (
  <Form.Control.Feedback
    className="mt-1"
    data-testid="feedback-message-container"
    icon={(
      <Spinner
        animation="border"
        className="mie-3 loading-teams-spinner__medium"
        screenReaderText="loading"
        data-testid="feedback-message-spinner"
      />
          )}
  >
    {title}
  </Form.Control.Feedback>
);

FeedbackMessage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default FeedbackMessage;

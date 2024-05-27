import React from 'react';
import { render, screen } from '@testing-library/react';
import FeedbackMessage from './FeedbackMessage';

describe('FeedbackMessage Component', () => {
  test('renders with the provided title', () => {
    const title = 'Loading...';
    render(<FeedbackMessage title={title} />);
    const feedbackMessageContainer = screen.getByTestId('feedback-message-container');
    expect(feedbackMessageContainer).toBeInTheDocument();
    expect(feedbackMessageContainer).toHaveTextContent(title);
  });

  test('renders the spinner element', () => {
    render(<FeedbackMessage title="Loading..." />);
    const spinnerElement = screen.getByTestId('feedback-message-spinner');
    expect(spinnerElement).toBeInTheDocument();
  });

  test('renders the spinner with the correct CSS classes', () => {
    render(<FeedbackMessage title="Loading..." />);
    const spinnerElement = screen.getByTestId('feedback-message-spinner');
    expect(spinnerElement).toHaveClass('mie-3 loading-teams-spinner__medium');
  });
});

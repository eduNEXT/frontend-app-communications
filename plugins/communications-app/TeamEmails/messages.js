import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  /* index.jsx Messages */
  teamEmailsTitle: {
    id: 'team.emails.title',
    defaultMessage: 'Teams',
    description: 'Title for checkboxes of team members',
  },
  teamEmailsFeedBackLoadingTeams: {
    id: 'team.emails.feedback.loading.teams',
    defaultMessage: 'Loading teams',
    description: 'A loading shown to the user while teams are being fetching',
  },
});

export default messages;

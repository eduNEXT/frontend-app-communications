import React from 'react';
import PropTypes from 'prop-types';
import useAsyncReducer, { combineReducers } from '../../../utils/useAsyncReducer';
import editor, { editorInitialState } from '../bulk-email-form/data/reducer';
import scheduledEmailsTable, {
  scheduledEmailsTableInitialState,
} from '../bulk-email-task-manager/bulk-email-scheduled-emails-table/data/reducer';

export const BulkEmailContext = React.createContext();

const BulkEmailProvider = ({ children }) => {
  const initialState = {
    editor: editorInitialState,
    scheduledEmailsTable: scheduledEmailsTableInitialState,
  };
  const [state, dispatch] = useAsyncReducer(
    combineReducers({ editor, scheduledEmailsTable }),
    initialState,
  );
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <BulkEmailContext.Provider value={[state, dispatch]}>{children}</BulkEmailContext.Provider>;
};

BulkEmailProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default BulkEmailProvider;

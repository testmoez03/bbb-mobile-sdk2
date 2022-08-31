import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/users';
import meetingReducer from './slices/meeting';
import voiceUsersReducer from './slices/voice-users';
import pollsReducer from './slices/polls';
import padsReducer from './slices/pads';
import currentPollReducer from './slices/current-poll';
import groupChatReducer from './slices/group-chat';
import currentUserReducer from './slices/current-user';
import presentationsReducer from './slices/presentations';
import slidesReducer from './slices/slides';
import externalVideoMeetingsReducer from './slices/external-video-meetings';

export const store = configureStore({
  reducer: {
    meetingCollection: meetingReducer,
    usersCollection: usersReducer,
    voiceUsersCollection: voiceUsersReducer,
    pollsCollection: pollsReducer,
    padsCollection: padsReducer,
    presentationsCollection: presentationsReducer,
    slidesCollection: slidesReducer,
    currentPollCollection: currentPollReducer,
    currentUserCollection: currentUserReducer,
    externalVideoMeetingsCollection: externalVideoMeetingsReducer,
    groupChatCollection: groupChatReducer,
    // ...other collections
  },
});

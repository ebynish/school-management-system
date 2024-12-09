import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tweets: [],
};

const tweetsSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    addTweet: (state, action) => {
      state.tweets.unshift(action.payload); // Add new tweet at the beginning
    },
    setTweets: (state, action) => {
      state.tweets = action.payload; // Set tweets from API
    },
  },
});

export const { addTweet, setTweets } = tweetsSlice.actions;
export default tweetsSlice.reducer;

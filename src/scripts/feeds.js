import axios from 'axios';
import parser from './parser.js';

export const addNewFeed = (state, newFeedUrl) => new Promise((resolve, reject) => {
  const { feeds: currentFeeds, posts: currentPosts } = state;
  const currentFeedsUrls = currentFeeds.map((currentFeed) => currentFeed.url);
  const currentPostsNames = currentPosts.map((currentPost) => currentPost.title);
  const proxy = new URL('/get', 'https://allorigins.hexlet.app');

  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', newFeedUrl);

  const response = axios.get(proxy).catch((e) => {
    const error = e;
    error.isAxiosError = true;
    reject(error);
  });

  response.then((result) => {
    try {
      const contents = parser(result.data.contents, result.data.status.url);
      const { feed: parsedFeed, posts: parsedPosts } = contents;

      if (!currentFeedsUrls.includes(parsedFeed.url)) {
        currentFeeds.unshift(parsedFeed);
      }

      const newPosts = parsedPosts.filter((parsedPost) => !currentPostsNames.includes(parsedPost.title));

      if (newPosts.length) {
        currentPosts.unshift(...newPosts);
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    reject(e);
  });
});

export const updateFeeds = (state) => {
  const timer = setTimeout(() => {
    const currentFeeds = state.feeds;
    const currentFeedsUrls = currentFeeds.map((currentFeed) => currentFeed.url);
    const promises = currentFeedsUrls.map((url) => addNewFeed(state, url));

    Promise.all(promises).then(() => {
      clearTimeout(timer);
      updateFeeds(state);
    });
  }, state.updateTimer);
};

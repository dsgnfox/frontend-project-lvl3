import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import parser from './parser.js';

export const addNewFeed = (state, newFeedUrl) => {
  const { feeds: currentFeeds, posts: currentPosts } = state;
  const currentFeedsUrls = currentFeeds.map((currentFeed) => currentFeed.url);
  const currentPostsTitles = currentPosts.map((currentPost) => currentPost.title);
  const currentPostsUrls = currentPosts.map((currentPost) => currentPost.url);
  const proxy = new URL('/get', 'https://allorigins.hexlet.app');

  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', newFeedUrl);

  return axios.get(proxy).then((result) => {
    const url = result.config.url.searchParams.get('url');
    const contents = parser(result.data.contents, url);
    const { feed: parsedFeed, posts: parsedPosts } = contents;

    if (!currentFeedsUrls.includes(parsedFeed.url)) {
      currentFeeds.unshift(parsedFeed);
    }

    const newPosts = parsedPosts.map((parsedPost) => ({
      ...parsedPost,
      postId: uniqueId()
    })).filter((newPost) => {
      const { title: newTitle, url: newUrl } = newPost;
      return !currentPostsTitles.includes(newTitle) && !currentPostsUrls.includes(newUrl);
    });

    if (newPosts.length) {
      currentPosts.unshift(...newPosts);
    }
  });
};

export const updateFeeds = (state) => {
  const timer = setTimeout(() => {
    const currentFeeds = state.feeds;
    const currentFeedsUrls = currentFeeds.map((currentFeed) => currentFeed.url);
    const promises = currentFeedsUrls.map((url) => addNewFeed(state, url));

    Promise.all(promises).finally(() => {
      clearTimeout(timer);
      updateFeeds(state);
    });
  }, state.updateTimer);
};

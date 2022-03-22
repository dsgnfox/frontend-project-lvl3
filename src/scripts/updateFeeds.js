import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import parseFeed from './parseFeed.js';

let timer = null;
const url = new URL('/get', 'https://allorigins.hexlet.app');
url.searchParams.set('disableCache', 'true');

const updateFeeds = (feeds, posts, newFeedSource = null) => {
  const addedSource = feeds.map((feed) => feed.source);
  const sources = newFeedSource ? [newFeedSource, ...addedSource] : addedSource;

  const promises = sources.map((source) => new Promise((resolve, reject) => {
    url.searchParams.set('url', source);

    axios.get(url).then((response) => {
      try {
        const contents = parseFeed(response.data.contents);
        const feedId = uniqueId();
        const postItems = Array.from(contents.querySelectorAll('item'));
        const sourceUrl = response.data.status.url;

        if (!addedSource.includes(sourceUrl)) {
          feeds.unshift({
            id: feedId,
            source: sourceUrl,
            title: contents.querySelector('title').textContent,
            description: contents.querySelector('description').textContent,
          });
        }

        const items = postItems.map((postItem) => ({
          feedId,
          postId: uniqueId(),
          title: postItem.querySelector('title').textContent,
          description: postItem.querySelector('description').textContent,
          link: postItem.querySelector('link').textContent,
        })).filter((postItem) => {
          const postsNames = posts.map((post) => post.title);
          return !postsNames.includes(postItem.title);
        });

        posts.unshift(...items);
        clearInterval(timer);
        resolve();
      } catch (e) {
        reject(e);
      }
    }).catch((e) => {
      const error = e;
      error.isAxiosError = true;
      reject(error);
    }).finally(() => {
      timer = setTimeout(() => {
        updateFeeds(feeds, posts);
      }, 5000);
    });
  }));

  return Promise.all(promises);
};

export default updateFeeds;

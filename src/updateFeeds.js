import axios from 'axios';
import { uniqueId } from 'lodash';
import parseFeed from './parseFeed';

let timer = null;
const url = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
url.searchParams.set('disableCache', 'true');

const updateFeeds = (feeds, posts, newFeedSource = null) => {
  const addedSource = feeds.map((feed) => feed.source);
  const sources = newFeedSource ? [newFeedSource, ...addedSource] : addedSource;

  return new Promise((resolve, reject) => {
    sources.forEach((source) => {
      url.searchParams.set('url', source);
      try {
        const request = axios.get(url);
        request.then((response) => {
          const contents = parseFeed(response.data.contents);
          const id = uniqueId();
          const postItems = Array.from(contents.querySelectorAll('item'));
          const sourceUrl = response.data.status.url;

          if (!addedSource.includes(sourceUrl)) {
            feeds.unshift({
              id,
              source: sourceUrl,
              title: contents.querySelector('title').textContent,
              description: contents.querySelector('description').textContent,
            });
          }

          const items = postItems.map((postItem) => ({
            feedId: id,
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
        }).catch((e) => {
          reject(e);
        }).finally(() => {
          timer = setTimeout(() => {
            updateFeeds(feeds, posts);
          }, 3000);
        });
      } catch {
        const error = new Error();
        error.isAxiosError = true;
        throw error;
      }
    });
  });
};

export default updateFeeds;

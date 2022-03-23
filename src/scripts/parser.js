import uniqueId from 'lodash/uniqueId.js';

export default (feed, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(feed, 'text/xml');
  const parsererror = doc.querySelector('parsererror');

  if (parsererror) {
    const error = new Error();
    error.isParsingError = true;
    throw error;
  }

  const feedId = uniqueId();
  const postItems = Array.from(doc.querySelectorAll('item'));

  return {
    feed: {
      id: feedId,
      url,
      title: doc.querySelector('title').textContent,
      description: doc.querySelector('description').textContent,
    },
    posts: postItems.map((postItem) => ({
      feedId,
      postId: uniqueId(),
      title: postItem.querySelector('title').textContent,
      description: postItem.querySelector('description').textContent,
      link: postItem.querySelector('link').textContent,
    })),
   };
};

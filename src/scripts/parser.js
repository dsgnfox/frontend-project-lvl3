export default (feed, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(feed, 'text/xml');
  const parsererror = doc.querySelector('parsererror');

  if (parsererror) {
    const error = new Error();
    error.isParsingError = true;
    throw error;
  }

  const postItems = Array.from(doc.querySelectorAll('item'));

  return {
    feed: {
      url,
      title: doc.querySelector('title').textContent,
      description: doc.querySelector('description').textContent,
    },
    posts: postItems.map((postItem) => ({
      url,
      title: postItem.querySelector('title').textContent,
      description: postItem.querySelector('description').textContent,
      link: postItem.querySelector('link').textContent,
    })),
  };
};

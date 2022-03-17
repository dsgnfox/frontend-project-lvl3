export default (feed) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(feed, 'text/xml');
  const parsererror = doc.querySelector('parsererror');

  if (!parsererror) {
    return doc;
  }

  const error = new Error();
  error.isParsingError = true;
  throw error;
};

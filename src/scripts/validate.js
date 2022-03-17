import * as yup from 'yup';

export default (fields, feedsLink = []) => {
  const schema = yup.object().shape({
    source: yup.string()
      .url('url_must_be_valid')
      .notOneOf(feedsLink, 'url_already_exists'),
  });

  return schema.validate(fields);
};

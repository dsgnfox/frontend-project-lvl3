import i18next from 'i18next';
import * as yup from 'yup';
import resources from './locales/index.js';
import view from './view';
import updateFeeds from './updateFeeds.js';
import elements from './elements.js';

const validate = (fields, feedsLink = []) => {
  const schema = yup.object().shape({
    source: yup.string()
      .url('url_must_be_valid')
      .notOneOf(feedsLink, 'url_already_exists'),
  });

  return schema.validate(fields);
};

const app = (i18n) => {
  const state = {
    form: {
      status: 'idle', // filling // invalid
      error: null,
    },
    loadingProcess: {
      status: 'idle', // idle // loading // success // failing
      error: null,
    },
    feeds: [],
    posts: [],
    reloadTimerMs: 3000,
  };

  const watchedState = view(state, elements, i18n);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    watchedState.form.status = 'idle';
    watchedState.loadingProcess.status = 'idle';
    watchedState.loadingProcess.status = 'loading';

    const source = new FormData(e.target).get('url');
    const addedFeedsUrls = watchedState.feeds.map((feed) => feed.source);
    const validation = validate({ source }, addedFeedsUrls);

    validation.then(() => {
      watchedState.form.status = 'filling';

      updateFeeds(watchedState.feeds, watchedState.posts, source).then(() => {
        watchedState.loadingProcess.status = 'success';
      }).catch((err) => {
        let error = 'unknown_error';

        if (err.isParsingError) {
          error = 'rss_invalid';
        } else if (err.isAxiosError) {
          error = 'network_error';
        }

        watchedState.loadingProcess.error = error;
        watchedState.loadingProcess.status = 'failing';
      });
    }).catch((err) => {
      watchedState.form.error = err.message;
      watchedState.form.status = 'invalid';
    });
  });
};

export default () => {
  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru',
    resources,
  }).then(() => app(i18nextInstance));
};

import i18next from 'i18next';
import * as yup from 'yup';
import resources from './locales/index.js';
import view from './view';

yup.setLocale({
  string: {
    url: () => ({ key: 'url_must_be_valid' }),
    notOneOf: () => ({ key: 'url_already_exists' }),
  },
});

const validate = (fields, feeds = []) => {
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(feeds),
  });
  return schema.validate(fields, { abortEarly: false });
};

const app = (i18n) => {
  const state = {
    rssForm: {
      state: null,
      errors: [],
      data: {
        url: null,
      },
    },
    feeds: [],
    posts: [],
  };

  const watchedState = view(state, i18n);

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));
    watchedState.rssForm.data = formData;

    const validation = validate(watchedState.rssForm.data, watchedState.feeds);
    validation.then(() => {
      watchedState.feeds.push(formData.url);
      watchedState.rssForm.state = 'success';
    }).catch((err) => {
      watchedState.rssForm.errors = err.errors;
      watchedState.rssForm.state = 'invalid';
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

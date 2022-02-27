import * as yup from 'yup';
import view from './view';

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

const watchedState = view(state);

const validate = (fields, feeds = []) => {
  const schema = yup.object().shape({
    url: yup.string().url('Ссылка должна быть валидным URL').notOneOf(feeds, 'RSS уже существует'),
  });
  return schema.validate(fields, { abortEarly: false });
};

export default () => {
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

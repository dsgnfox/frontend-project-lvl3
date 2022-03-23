import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import view from './view.js';
import { addNewFeed, updateFeeds } from './feeds.js';

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
    uiState: {
      popup: [],
      viewedPostsIds: new Set(),
    },
    updateTimer: 5000,
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: {
      box: document.querySelector('.modal'),
      title: document.querySelector('.modal-title'),
      description: document.querySelector('.modal-description'),
      link: document.querySelector('.modal-link'),
    },
  };

  const {
 form, submitButton, modal, postsContainer,
} = elements;
  const watchedState = view(state, elements, i18n);

  const validate = (fields, feedsLink = []) => {
    const schema = yup.object().shape({
      source: yup.string()
        .url('url_must_be_valid')
        .notOneOf(feedsLink, 'url_already_exists'),
    });

    return schema.validate(fields);
  };

  const formHandler = (e) => {
    e.preventDefault();

    watchedState.form.status = 'idle';
    watchedState.loadingProcess.status = 'loading';

    const source = new FormData(form).get('url');
    const addedFeedsUrls = watchedState.feeds.map((feed) => feed.url);
    const validation = validate({ source }, addedFeedsUrls);

    validation.then(() => {
      watchedState.form.status = 'filling';

      addNewFeed(watchedState, source).then(() => {
        watchedState.loadingProcess.status = 'success';
        if (watchedState.feeds.length === 1) {
          updateFeeds(state);
        }
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
  };

  const popupShowHandler = () => {
    modal.box.addEventListener('show.bs.modal', (e) => {
      const button = e.relatedTarget;
      const { postId } = button.dataset;
      const currentPost = watchedState.posts.find((post) => post.postId === postId);

      watchedState.uiState.popup = (currentPost);
    });
  };

  const viewedPostsHanlder = (e) => {
    const { postId } = e.target.dataset;

    if (!postId) {
      return;
    }

    const { viewedPostsIds } = watchedState.uiState;

    viewedPostsIds.add(postId);
  };

  form.addEventListener('submit', formHandler);
  submitButton.addEventListener('click', formHandler);

  popupShowHandler();

  postsContainer.addEventListener('click', viewedPostsHanlder);
};

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources,
  }).then(() => app(i18nextInstance));
};

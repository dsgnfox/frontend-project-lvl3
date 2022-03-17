import i18next from 'i18next';
import resources from './locales/index';
import view from './view';
import controllers from './controllers';

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
  };

  const watchedState = view(state, i18n);

  controllers.form(watchedState);
  controllers.popup(watchedState);
  controllers.viewedPosts(watchedState);
};

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources,
  }).then(() => app(i18nextInstance));
};

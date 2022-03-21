import updateFeeds from '../updateFeeds.js';
import elements from '../elements.js';
import validate from '../validate.js';

export default (watchedState) => {
  const { form } = elements;
  const state = watchedState;

  document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      state.form.status = 'idle';
      state.loadingProcess.status = 'idle';
      state.loadingProcess.status = 'loading';

      const source = new FormData(form).get('url');
      const addedFeedsUrls = state.feeds.map((feed) => feed.source);
      const validation = validate({ source }, addedFeedsUrls);

      validation.then(() => {
        state.form.status = 'filling';

        updateFeeds(state.feeds, state.posts, source).then(() => {
          state.loadingProcess.status = 'success';
        }).catch((err) => {
          let error = 'unknown_error';

          if (err.isParsingError) {
            error = 'rss_invalid';
          } else if (err.isAxiosError) {
            error = 'network_error';
          }

          state.loadingProcess.error = error;
          state.loadingProcess.status = 'failing';
        });
      }).catch((err) => {
        state.form.error = err.message;
        state.form.status = 'invalid';
      });
    });
  });
};

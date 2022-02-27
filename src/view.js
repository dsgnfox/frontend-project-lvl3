import onChange from 'on-change';

export default (state, i18n) => {
  const urlInput = document.querySelector('input[name="url"]');
  const feedbackContainer = document.querySelector('.feedback');

  return onChange(state, (path, value) => {
    if (path === 'rssForm.state') {
      switch (value) {
        case 'success': {
          urlInput.value = '';
          feedbackContainer.textContent = i18n.t('rss_success_loaded');
          urlInput.classList.remove('is-invalid');
          feedbackContainer.classList.remove('text-danger');
          feedbackContainer.classList.add('text-success');
          break;
        }
        case 'invalid': {
          const { errors } = state.rssForm;
          const errorsText = errors.map((error) => i18n.t(error.key));
          urlInput.classList.add('is-invalid');
          feedbackContainer.classList.add('text-danger');
          feedbackContainer.textContent = `${errorsText.join('<br/>')}`;
          break;
        }
        default: {
          throw new Error(`Неизвестное состояние: ${value}`);
        }
      }
    }
  });
};

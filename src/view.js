import onChange from 'on-change';

export default (state) => {
  const urlInput = document.querySelector('input[name="url"]');
  const feedbackContainer = document.querySelector('.feedback');

  return onChange(state, (path, value) => {
    if (path === 'rssForm.state') {
      switch (value) {
        case 'success': {
          urlInput.value = '';
          feedbackContainer.textContent = 'RSS успешно загружен';
          urlInput.classList.remove('is-invalid');
          feedbackContainer.classList.remove('text-danger');
          feedbackContainer.classList.add('text-success');
          break;
        }
        case 'invalid': {
          const { errors } = state.rssForm;
          urlInput.classList.add('is-invalid');
          feedbackContainer.classList.add('text-danger');
          feedbackContainer.textContent = `${errors.join('<br/>')}`;
          break;
        }
        default: {
          throw new Error(`Неизвестное состояние: ${value}`);
        }
      }
    }
  });
};

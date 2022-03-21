import onChange from 'on-change';
import elements from './elements.js';

const {
  input, submitButton, feedback, feedsContainer, postsContainer, modal,
} = elements;
const { title: modalTitle, description: modalDescription, link: modalLink } = modal;

const createElement = (type, classes, text) => {
  const element = document.createElement(type);
  element.classList.add(...classes);

  if (text) {
    element.textContent = text;
  }

  return element;
};

const createFeeds = (state, i18n) => {
  const { feeds } = state;

  const items = feeds.map((feed) => {
    const item = createElement('li', ['list-group-item', 'border-0', 'border-end-0']);
    const title = createElement('h3', ['h6', 'm-0'], feed.title);
    const description = createElement('p', ['m-0', 'small', 'text-black-50'], feed.description);

    item.append(...[title, description]);

    return item;
  });

  const itemsContainer = createElement('ul', ['list-group', 'border-0', 'rounded-0']);

  itemsContainer.append(...items);

  const title = createElement('h2', ['card-title', 'h4'], i18n.t('ui.feedsTitle'));
  const titleContainer = createElement('div', ['card-body']);
  const card = createElement('div', ['card', 'border-0']);

  titleContainer.append(title);
  card.append(...[titleContainer, itemsContainer]);

  return card;
};

const createPosts = (state, i18n) => {
  const { posts } = state;

  const items = posts.map((post) => {
    const { postId } = post;
    const { viewedPostsIds } = state.uiState;
    const item = createElement('li', ['list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0']);
    const linkClasses = viewedPostsIds.has(postId) ? ['fw-normal', 'link-secondary'] : ['fw-bold'];
    const link = createElement('a', linkClasses, post.title);
    const button = createElement('button', ['btn', 'btn-outline-primary', 'btn-sm'], i18n.t('ui.viewButton'));

    button.name = 'add';
    button.ariaLabel = 'add';
    button.role = 'button';
    button.dataset.postId = postId;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    link.dataset.postId = postId;
    link.target = '_blank';
    link.href = post.link;
    link.role = link;

    item.append(link);
    item.append(button);

    return item;
  });

  const itemsContainer = createElement('ul', ['list-group', 'border-0', 'rounded-0']);

  itemsContainer.append(...items);

  const title = createElement('h2', ['card-title', 'h4'], i18n.t('ui.postsTitle'));
  const titleContainer = createElement('div', ['card-body']);
  const card = createElement('div', ['card', 'border-0']);

  titleContainer.append(title);
  card.append(...[titleContainer, itemsContainer]);

  return card;
};

export default (state, i18n) => onChange(state, (path, value) => {
  switch (path) {
    case 'loadingProcess.status': {
      switch (value) {
        case 'idle': {
          break;
        }
        case 'loading': {
          input.readOnly = true;
          submitButton.disabled = true;
          submitButton.classList.add('disabled');
          feedback.textContent = '';
          break;
        }
        case 'success': {
          input.readOnly = false;
          submitButton.disabled = false;
          submitButton.classList.remove('disabled');
          feedback.textContent = i18n.t('messages.success.rss_success_loaded');
          feedback.classList.remove('text-danger');
          feedback.classList.add('text-success');
          input.value = '';
          break;
        }
        case 'failing': {
          input.readOnly = false;
          submitButton.disabled = false;
          feedback.textContent = i18n.t(`messages.errors.${state.loadingProcess.error}`);
          submitButton.classList.remove('disabled');
          feedback.classList.add('text-danger');
          feedback.classList.remove('text-success');
          break;
        }
        default: {
          throw new Error(`Unknown loading process: ${value}`);
        }
      }
      break;
    }
    case 'loadingProcess.error': {
      break;
    }
    case 'form.status': {
      switch (value) {
        case 'idle': {
          break;
        }
        case 'filling': {
          input.focus();
          input.classList.remove('is-invalid');
          feedback.classList.remove('text-danger');
          feedback.classList.add('text-success');
          break;
        }
        case 'invalid': {
          input.classList.add('is-invalid');
          feedback.classList.add('text-danger');
          feedback.textContent = i18n.t(`messages.errors.${state.form.error}`);
          submitButton.disabled = false;
          submitButton.classList.remove('disabled');
          input.readOnly = false;
          break;
        }
        default: {
          throw new Error(`Unknown form status: ${value}`);
        }
      }
      break;
    }
    case 'form.error': {
      break;
    }
    case 'feeds': {
      feedsContainer.innerHTML = '';
      const feeds = createFeeds(state, i18n);
      feedsContainer.append(feeds);
      break;
    }
    case 'posts':
    case 'uiState.viewedPostsIds': {
      postsContainer.innerHTML = '';
      const posts = createPosts(state, i18n);
      postsContainer.append(posts);
      break;
    }
    case 'uiState.popup': {
      modalTitle.textContent = value.title;
      modalDescription.textContent = value.description;
      modalLink.href = value.link;
      break;
    }
    default: {
      throw new Error(`Unknown state path: ${value}`);
    }
  }
});

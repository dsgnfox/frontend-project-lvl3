import onChange from 'on-change';

const createElement = (type, classes = [], text) => {
  const element = document.createElement(type);
  element.classList.add(...classes);
  if (text) {
    element.textContent = text;
  }
  return element;
};

const createFeeds = (feeds) => {
  const items = feeds.map((feed) => {
    const item = createElement('li', ['list-group-item', 'border-0', 'border-end-0']);
    const title = createElement('h3', ['h6', 'm-0'], feed.title);
    const description = createElement('p', ['m-0', 'small', 'text-black-50'], feed.description);
    item.append(...[title, description]);
    return item;
  });
  const itemsContainer = createElement('ul', ['list-group', 'border-0', 'rounded-0']);
  itemsContainer.append(...items);
  const title = createElement('h2', ['card-title', 'h4'], 'Фиды');
  const titleContainer = createElement('div', ['card-body']);
  const card = createElement('div', ['card', 'border-0']);
  titleContainer.append(title);
  card.append(...[titleContainer, itemsContainer]);
  return card;
};

const createPosts = (posts) => {
  const items = posts.map((post) => {
    const item = createElement('li', ['list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0']);
    const link = createElement('a', ['fw-bold'], post.title);
    // const button = createElement('button', ['btn', 'btn-outline-primary', 'btn-sm'], 'Просмотр');
    link.dataset.id = post.feedId;
    link.href = post.link;
    item.append(link);
    return item;
  });
  const itemsContainer = createElement('ul', ['list-group', 'border-0', 'rounded-0']);
  itemsContainer.append(...items);
  const title = createElement('h2', ['card-title', 'h4'], 'Посты');
  const titleContainer = createElement('div', ['card-body']);
  const card = createElement('div', ['card', 'border-0']);
  titleContainer.append(title);
  card.append(...[titleContainer, itemsContainer]);
  return card;
};

export default (state, elements, i18n) => onChange(state, (path, value) => {
  const {
    input, submitButton, feedback, feedsContainer, postsContainer,
  } = elements;
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
          feedback.textContent = i18n.t('rss_success_loaded');
          feedback.classList.remove('text-danger');
          feedback.classList.add('text-success');
          input.value = '';
          break;
        }
        case 'failing': {
          input.readOnly = false;
          submitButton.disabled = false;
          feedback.textContent = i18n.t(state.loadingProcess.error);
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
          input.value = '';
          input.focus();
          input.classList.remove('is-invalid');
          feedback.classList.remove('text-danger');
          feedback.classList.add('text-success');
          break;
        }
        case 'invalid': {
          input.classList.add('is-invalid');
          feedback.classList.add('text-danger');
          feedback.textContent = i18n.t(state.form.error);
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
      const feeds = createFeeds(value);
      feedsContainer.append(feeds);
      break;
    }
    case 'posts': {
      postsContainer.innerHTML = '';
      const posts = createPosts(value);
      postsContainer.append(posts);
      break;
    }
    default: {
      throw new Error(`Unknown state path: ${value}`);
    }
  }
});

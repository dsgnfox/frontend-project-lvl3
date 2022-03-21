import elements from '../elements.js';

const { postsContainer } = elements;

export default (watchedState) => {
  const state = watchedState;

  postsContainer.addEventListener('click', (e) => {
    const { postId } = e.target.dataset;

    if (!postId) {
      return false;
    }

    const { viewedPostsIds } = state.uiState;

    viewedPostsIds.add(postId);

    return true;
  });
};

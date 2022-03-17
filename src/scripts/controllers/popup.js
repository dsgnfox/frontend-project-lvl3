import 'bootstrap/js/dist/modal';
import elements from '../elements';

const { box } = elements.modal;

export default (watchedState) => {
  const state = watchedState;

  box.addEventListener('show.bs.modal', (e) => {
    const button = e.relatedTarget;
    const { postId } = button.dataset;
    const currentPost = state.posts.find((post) => post.postId === postId);

    state.uiState.popup = (currentPost);
  });
};

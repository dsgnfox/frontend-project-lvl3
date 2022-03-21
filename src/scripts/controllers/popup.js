/* eslint no-unused-vars: "off" */

import * as bootstrap from 'bootstrap';
import elements from '../elements.js';

const { box } = elements.modal;

export default (watchedState) => {
  const state = watchedState;

  document.addEventListener('DOMContentLoaded', () => {
    box.addEventListener('show.bs.modal', (e) => {
      const button = e.relatedTarget;
      const { postId } = button.dataset;
      const currentPost = state.posts.find((post) => post.postId === postId);

      state.uiState.popup = (currentPost);
    });
  });
};

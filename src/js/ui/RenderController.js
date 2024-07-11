import Variable from './RenderVariable.js';
import RenderApp from './RenderApp';
import { fromEvent, Subject } from 'rxjs';

export default class RenderController {
  constructor(container) {
    this.container = document.querySelector(container);
    this.renderApp = new RenderApp();
    this.page = {
      title: null,
      posts: null,
    };

    this.streams = {
      clickListPosts: {
        stream$: null,
        subscriptions: [],
      },
      loadImages: {
        stream$: null,
        subscriptions: [],
      },
    };
  }

  renderPageApp() {
    const header = this.renderApp.createHeaderPage();
    const title = this.renderApp.createPageTitle();
    header.append(title);

    const main = this.renderApp.createMainPage();
    const listPosts = this.renderApp.createListPosts();
    main.append(listPosts);

    this.page.title = title;
    this.page.posts = listPosts;

    this.container.append(header, main);
  }

  createStreams() {
    this.streams.clickListPosts.stream$ = fromEvent(this.page.posts, 'click');
    this.streams.loadImages.stream$ = new Subject();
  }

  createSubscriptions() {
    this.subscribeToStream('clickListPosts', this.toggleVisibleComments);
    this.subscribeToStream('loadImages', this.scrollToLastPost);
  }

  subscribeToStream(stream, callback) {
    const targetStream = this.streams[stream];
    const subscription = targetStream.stream$.subscribe({
      next: callback.bind(this),
    });
    targetStream.subscriptions.push(subscription);
  }

  reRenderListPosts(posts) {
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return;
    }

    this.renderListPosts(posts);
  }

  renderListPosts(posts) {
    const arrayPostElements = this.createArrayPostElements(posts);

    this.clearListPosts();
    this.page.posts.append(...arrayPostElements);
    this.scrollToLastPost();
  }

  createArrayPostElements(posts) {
    const arrayPosts = [];
    posts.forEach((post) => {
      const postEl = this.renderApp.createPost(post);
      this.addEventListenerForScrollToLastPost(postEl);

      if (post.comments) {
        const commentListEl = postEl.querySelector(
          '[data-name="listComments"]',
        );
        const arrayCommentElements = this.createArrayCommentElements(
          post.comments,
        );
        commentListEl.append(...arrayCommentElements);
      }
      arrayPosts.push(postEl);
    });

    return arrayPosts;
  }

  createArrayCommentElements(comments) {
    const arrayCommentElements = [];

    comments.forEach((comment) => {
      const commentEl = this.renderApp.createComment(comment);
      arrayCommentElements.push(commentEl);
    });

    return arrayCommentElements;
  }

  clearListPosts() {
    this.page.posts.innerHTML = '';
  }

  clearSubscriptionAllStream() {
    this.streams.forEach((stream) => {
      this.clearSubscriptionStream(stream);
    });
  }

  clearSubscriptionStream(stream) {
    const targetStream = this.streams[stream];
    targetStream.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

    targetStream.subscriptions = [];
  }

  addEventListenerForScrollToLastPost(post) {
    const img = post.querySelector('[data-name="postImg"]');

    img.addEventListener('load', () => this.streams.loadImages.stream$.next(), {
      once: true,
    });
  }

  scrollToLastPost() {
    const listPostCoords = this.page.posts.getBoundingClientRect();
    const top = listPostCoords.height;

    window.scrollBy({
      top,
      behavior: 'smooth',
    });
  }

  toggleVisibleComments({ target }) {
    if (!target.classList.contains('post-toggle-comments-visible')) {
      return;
    }

    const post = target.closest('[data-name="post"]');
    const comments = post.querySelector('[data-name="comments"]');

    if (comments.classList.contains('hidden-item')) {
      this.showListComments({ toggler: target, comments });
      return;
    }

    if (!comments.classList.contains('hidden-item')) {
      this.hideListComments({ toggler: target, comments });
      return;
    }
  }

  showListComments({ toggler, comments }) {
    this.hideVisibleListsComments();
    comments.classList.remove('hidden-item');
    comments.dataset.visible = true;
    toggler.textContent = Variable.toggleVisibleComments.show;
  }

  hideListComments({ toggler, comments }) {
    comments.classList.add('hidden-item');
    comments.dataset.visible = false;
    toggler.textContent = Variable.toggleVisibleComments.hide;
  }

  hideVisibleListsComments() {
    const visibleListsComments = this.page.posts.querySelectorAll(
      '[data-name="comments"][data-visible=true]',
    );
    if (visibleListsComments) {
      visibleListsComments.forEach((comments) => {
        const post = comments.closest('[data-name="post"]');
        const toggler = post.querySelector(
          '[data-name="togglerVisibleComments"]',
        );
        this.hideListComments({ toggler, comments });
      });
    }
  }
}

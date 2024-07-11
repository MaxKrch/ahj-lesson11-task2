import Variable from './RenderVariable';
import Post from './elements/Post';
import Comment from './elements/Comment';

export default class RenderApp {
  createHeaderPage() {
    const header = document.createElement('header');
    header.classList.add('container', 'header-container');

    return header;
  }

  createPageTitle() {
    const title = document.createElement('h1');
    title.classList.add('page-title');
    title.textContent = Variable.titleContent.new;

    return title;
  }

  createMainPage() {
    const main = document.createElement('main');
    main.classList.add('container', 'main-container');

    return main;
  }

  createListPosts() {
    const listPosts = document.createElement('ul');
    listPosts.classList.add('list-posts');

    return listPosts;
  }

  createPost(post) {
    return new Post(post);
  }

  createComment(comment) {
    return new Comment(comment);
  }
}

import Variable from '../RenderVariable';
import Element from './Element';

export default class Post extends Element {
  constructor(post) {
    super();
    if (!post) {
      console.log('Некорректный пост');
      return;
    }
    return this.createElementPost(post);
  }

  createElementPost(post) {
    const { id, title, image, created, author } = post;

    const elementPost = document.createElement('li');
    elementPost.classList.add('post');
    elementPost.dataset.id = id;
    elementPost.dataset.name = 'post';
    elementPost.dataset.author = author.id;

    const elementInfo = this.createElementPostInfo(author, created);
    const elementContent = this.createElementPostContent(title, image);
    const elementTogglerVisible =
      this.createElementPostCommentTogglerVisible(id);
    const elementComments = this.createElementPostComments(id);

    elementPost.append(
      elementInfo,
      elementContent,
      elementTogglerVisible,
      elementComments,
    );

    return elementPost;
  }

  createElementPostInfo(author, created) {
    const { nick, id, avatar } = author;

    const elementInfo = document.createElement('div');
    elementInfo.classList.add('post-info');

    const elementAvatar = this.createElementAvatar({ nick, avatar });
    elementAvatar.classList.add('post-info-avatar');

    const elementNick = this.createElementNick({ nick, id });
    elementNick.classList.add('post-info-nick');

    const elementTime = this.createElementTime(created);
    elementTime.classList.add('post-info-time');

    elementInfo.append(elementAvatar, elementNick, elementTime);

    return elementInfo;
  }

  createElementPostContent(title, image) {
    const elementContent = document.createElement('div');
    elementContent.classList.add('post-content');

    const elementTitle = this.createElementTitle(title);
    const elementImageBlock = this.createElementImageBlock(title, image);

    elementContent.append(elementTitle, elementImageBlock);

    return elementContent;
  }

  createElementPostCommentTogglerVisible(id) {
    const elementToggler = document.createElement('div');
    elementToggler.classList.add(
      'post-comments-button',
      'post-toggle-comments-visible',
    );
    elementToggler.dataset.post = id;
    elementToggler.dataset.name = 'togglerVisibleComments';
    elementToggler.textContent = Variable.toggleVisibleComments.hide;

    return elementToggler;
  }

  createElementPostComments(id) {
    const elementComments = document.createElement('div');
    elementComments.classList.add('post-comments', 'hidden-item');
    elementComments.dataset.post = id;
    elementComments.dataset.name = 'comments';
    elementComments.dataset.commentsVisible = false;

    const elementTogglerSort = this.createElementTogglerSort(id);
    const elementListComment = this.createElementListComments(id);
    const elementButtonLoad = this.createElementButtonLoad(id);

    elementComments.append(
      elementTogglerSort,
      elementListComment,
      elementButtonLoad,
    );

    return elementComments;
  }

  createElementTitle(title) {
    const elementTitle = document.createElement('div');

    elementTitle.classList.add('post-content-title');
    elementTitle.textContent = title;

    return elementTitle;
  }

  createElementImageBlock(title, src) {
    const elementImageBlock = document.createElement('div');
    elementImageBlock.classList.add('post-content-img-block');

    const elementImageBgLeft = this.createElementImage(title, src);
    elementImageBgLeft.classList.add(
      'post-content-img-bg',
      'post-content-img-bg-left',
    );

    const elementImageBgRight = this.createElementImage(title, src);
    elementImageBgRight.classList.add(
      'post-content-img-bg',
      'post-content-img-bg-right',
    );

    const elementImage = this.createElementImage(title, src);
    elementImage.classList.add('post-content-img');
    elementImage.dataset.name = 'postImg';

    elementImageBlock.append(
      elementImageBgLeft,
      elementImageBgRight,
      elementImage,
    );

    return elementImageBlock;
  }

  createElementImage(title, src) {
    const elementImage = document.createElement('img');

    elementImage.setAttribute('src', src);
    elementImage.setAttribute('alt', title);

    return elementImage;
  }

  createElementTogglerSort(id) {
    const elementToggler = document.createElement('div');

    elementToggler.classList.add(
      'post-comments-button',
      'post-comments-toggler-sort',
    );
    elementToggler.dataset.post = id;
    elementToggler.textContent = Variable.toggleSortComments.new;

    return elementToggler;
  }

  createElementListComments(id) {
    const elementList = document.createElement('ul');

    elementList.classList.add('post-comments-list');
    elementList.dataset.post = id;
    elementList.dataset.name = 'listComments';

    return elementList;
  }

  createElementButtonLoad(id) {
    const elementButtonLoad = document.createElement('div');

    elementButtonLoad.classList.add(
      'post-comments-button',
      'post-comments-button-load',
    );
    elementButtonLoad.dataset.post = id;
    elementButtonLoad.textContent = Variable.buttonLoadComments;

    return elementButtonLoad;
  }
}

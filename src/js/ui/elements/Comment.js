import Element from './Element';

export default class Comment extends Element {
  constructor(comment) {
    super();
    if (!comment) {
      console.log('Некорректный комментарий');
      return;
    }
    return this.createElementComment(comment);
  }

  createElementComment(comment) {
    const { id, post_id, content, created, author } = comment;
    const { id: author_id, nick, avatar } = author;

    const elementComment = document.createElement('li');
    elementComment.classList.add('post-comment');
    elementComment.dataset.id = id;
    elementComment.dataset.post = post_id;

    const elementAvatar = this.createElementAvatar({ author_id, nick, avatar });
    elementAvatar.classList.add('post-comment-avatar');
    const elementNick = this.createElementNick({ author_id, nick });
    elementNick.classList.add('post-comment-nick');
    const elementTime = this.createElementTime(created);
    elementTime.classList.add('post-comment-time');
    const elementContent = this.createElementContent(content);

    elementComment.append(
      elementAvatar,
      elementNick,
      elementTime,
      elementContent,
    );

    return elementComment;
  }

  createElementContent(content) {
    const elementContent = document.createElement('div');
    elementContent.classList.add('post-comment-text');
    elementContent.textContent = content;

    return elementContent;
  }
}

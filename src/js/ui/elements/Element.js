import moment from 'moment';

export default class Element {
  createElementNick({ author_id, nick }) {
    const elementNick = document.createElement('div');

    elementNick.dataset.author = author_id;
    elementNick.textContent = nick;

    return elementNick;
  }

  createElementAvatar({ author_id, nick, avatar }) {
    const elementAvatar = document.createElement('img');

    elementAvatar.classList.add('img-avatar');
    elementAvatar.dataset.author = author_id;
    elementAvatar.setAttribute('src', avatar);
    elementAvatar.setAttribute('alt', nick);

    return elementAvatar;
  }

  createElementTime(created) {
    const time = moment(created).locale('ru').format('HH:mm DD.MM.YY');
    const elementTime = document.createElement('div');

    elementTime.classList.add('post-info-time');
    elementTime.textContent = time;

    return elementTime;
  }
}

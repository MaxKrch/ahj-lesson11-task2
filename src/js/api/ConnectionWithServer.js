import {
  Subject,
  switchMap,
  catchError,
  forkJoin,
  map,
  shareReplay,
  of,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import Routes from './ConnectionVariable';

export default class Connection {
  constructor(url) {
    this.url = url;
    this.subscriptions = [];
    this.timerReStartRequestingData = {
      id: null,
      delay: 5000,
    };

    this.streamRequests$ = new Subject().pipe(
      switchMap((value) => value),
      shareReplay(),
    );
  }

  subscribeOnResponce(subscription) {
    this.streamRequests$.subscribe({
      next: subscription,
    });
    this.subscriptions.push(subscription);
  }

  startRequestingData() {
    this.requestListPostsWithComments({ sort: 'new' });
  }

  requestListPostsWithComments({ sort = 'new' }) {
    try {
      const request = this.requestPosts({ sort, comments: true });
      this.streamRequests$.next(request);
    } catch (err) {
      console.log('Ошибка запроса');
      this.reStartRequestingData();
    }
  }

  requestPosts({ sort = 'new', comments = true }) {
    const fullUrl = `${this.url}${Routes.posts[sort]}`;
    const request = ajax.getJSON(fullUrl).pipe(
      switchMap((response) => {
        if (response.success) {
          const posts = Array.isArray(response.data)
            ? response.data
            : [response.data];

          if (comments) {
            const postsWithComments = posts.map((post) =>
              this.requestComments({ post }),
            );
            return forkJoin(postsWithComments);
          }
          return [posts];
        }
      }),
      catchError(() => {
        console.log('Ошибка запроса постов');
        this.reStartRequestingData();

        return of(false);
      }),
    );
    return request;
  }

  requestComments({ post, sort = 'new' }) {
    const path = Routes.comments[sort].replace(`{post_id}`, post.id);
    const fullUrl = `${this.url}${path}`;
    const request = ajax.getJSON(fullUrl).pipe(
      map((response) => {
        if (response.success) {
          const comments = response.data;
          const postWithComments = {
            ...post,
            comments,
          };
          return postWithComments;
        }
        return post;
      }),
      catchError(() => {
        console.log('Ошибка запроса комментариев');

        return of(post);
      }),
    );
    return request;
  }

  reStartRequestingData() {
    if (this.timerReStartRequestingData.id) {
      clearTimeout(this.timerReStartRequestingData.id);
    }
    this.timerReStartRequestingData.id = setTimeout(() => {
      this.startRequestingData();
      this.timerReStartRequestingData.id = null;
    }, this.timerReStartRequestingData.delay);
  }

  clearSubscriptions() {
    this.subscriptions.forEach((item) => item.unsubscribe());
    this.subscriptions = [];
  }
}

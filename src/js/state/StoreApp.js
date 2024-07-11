import { Subject, scan, shareReplay } from 'rxjs';

export default class Store {
  constructor(state) {
    this.subscriptions = [];
    this.state$ = new Subject().pipe(
      scan((oldState, update) => this.updateState(oldState, update), state),
      shareReplay(),
    );
  }

  subscribeOnState(subscription) {
    const newSubscription = this.state$.subscribe({
      next: subscription,
    });
    this.subscriptions.push(newSubscription);
  }

  updateState(oldState, update) {
    if (!update) {
      return oldState;
    }

    return update;
  }

  addingData(newData) {
    this.state$.next(newData);
  }

  removeSubscription(subscription) {
    const indexSubscription = this.subscriptions.indexOf(subscription);

    if (indexSubscription >= 0) {
      this.subscriptions[indexSubscription].unsubscribe();
      this.subscriptions.splice(indexSubscription, 1);
    }
  }

  clearSubscriptions() {
    this.subscriptions.forEach((item) => item.unsubscribe());
    this.subscriptions = [];
  }
}

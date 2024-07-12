import RenderController from './ui/RenderController';
import Store from './state/StoreApp';
import Connection from './api/ConnectionWithServer.js';

export default class App {
  constructor({ container, state, url }) {
    if (!container || !state || !url) {
      console.log('Не все стартовые опции получены');
      return;
    }

    this.render = new RenderController(container);
    this.store = new Store(state);
    this.connection = new Connection(url);

    this.initialApp();
    this.createSubscription();
    this.startingApp();
  }

  initialApp() {
    this.render.renderPageApp();
    this.render.createStreams();
  }

  createSubscription() {
    this.render.createSubscriptions();
    this.store.subscribeOnState(
      this.render.reRenderListPosts.bind(this.render),
    );
    this.connection.subscribeOnResponce(this.store.addingData.bind(this.store));
  }

  startingApp() {
    this.connection.startRequestingData();
  }
}

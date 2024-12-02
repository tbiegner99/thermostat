import AbstractReducingStore from './AbstractReducingStore';
import ApplicationActions from '../actions/application';

class ApplicationStore extends AbstractReducingStore {
  constructor() {
    super();
    this.data = {
      currentUrl: window.location.pathname,
    };
  }

  get currentUrl() {
    return this.data.currentUrl;
  }

  handleEvent(action: { type: string; data: any }) {
    switch (action.type) {
      case ApplicationActions.URL_CHANGED:
        this.data.currentUrl = action.data.url;
        break;
      default:
        return false;
    }
    return true;
  }
}

export default new ApplicationStore();

import DispatcherFactory from '../dispatcher/DispatcherFactory';
import ApplicationActions from '../actions/application';

class BaseActionCreator {
  dispatch(action) {
    DispatcherFactory.dispatch(action);
  }

  createAction(type, payload) {
    return {
      type,
      data: payload,
    };
  }

  changeUrl(url) {
    this.dispatch(createAction(ApplicationActions.URL_CHANGED, { url }));
  }
}

export default BaseActionCreator;

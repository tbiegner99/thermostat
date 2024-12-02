/* eslint-disable no-underscore-dangle */
class DispatcherFactory {
  static _dispatcher: any = null;
  static setDispatchingStrategy(dispatcher: any) {
    DispatcherFactory._dispatcher = dispatcher;
  }

  static get dispatcher() {
    return DispatcherFactory._dispatcher;
  }

  static dispatch(action: any) {
    DispatcherFactory.dispatcher.dispatch(action);
  }
}

export default DispatcherFactory;

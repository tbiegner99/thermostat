class DispatcherFactory {
  static setDispatchingStrategy(dispatcher) {
    DispatcherFactory._dispatcher = dispatcher;
  }
  static get dispatcher() {
    return DispatcherFactory._dispatcher;
  }
  static dispatch(action) {
    DispatcherFactory.dispatcher.dispatch(action);
  }
}

export default DispatcherFactory;

class AbstracRedcingStore {
  constructor() {
    this.reduce = this.reduce.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
  }

  reduce(state, action) {
    const eventHandled = this.handleEvent(action);
    if (eventHandled || !state) {
      return { store: this };
    }
    return state;
  }

  handleEvent(action) {}
}

export default AbstracRedcingStore;

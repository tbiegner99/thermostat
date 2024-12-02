abstract class AbstracRedcingStore {
  data: any;
  constructor() {
    this.reduce = this.reduce.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
  }

  reduce(state: any, action: { type: string; data: any }) {
    const eventHandled = this.handleEvent(action);
    if (eventHandled || !state) {
      return { store: this };
    }
    return state;
  }

  abstract handleEvent(action: { type: string; data: any }): boolean;
}

export default AbstracRedcingStore;

class State {

  constructor() {
    this.state = {};
    this.listeners = [];
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
    this.listeners.forEach((fn) => fn.call(null, this.state));
    return this.state;
  }

  setState(newState) {
    return this.state = newState;
  }

  addListener(fn) {
    this.listeners.push(fn);
  }

}

export default new State();

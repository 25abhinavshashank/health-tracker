const listeners = new Set();

let state = {
  accessToken: null,
  user: null
};

export const tokenStore = {
  getState() {
    return state;
  },
  setState(next) {
    state = {
      accessToken: next?.accessToken || null,
      user: next?.user || null
    };
    listeners.forEach((listener) => listener(state));
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};


if (typeof window !== 'undefined') {
  window.process = {
    env: { NODE_ENV: 'development' },
    version: '',
    nextTick: (fn) => setTimeout(fn, 0),
  };
}

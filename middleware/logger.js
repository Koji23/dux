// Utility middleware for dev mode that mimics redux logger
const logger = (state, action, nextState) => {
  console.groupCollapsed('%cAction:', 'color:#f93;font-weight:700', action.type);
  console.log('%cPrev State:', 'color:#a6a6a6; font-weight:700', state);
  console.log('%cAction:', 'color:#00d0ff; font-weight:700', action);
  console.log('%cNext State:', 'color:#00d138; font-weight:700', nextState);
  console.trace();
  console.groupEnd();
};

export {
  logger,
};
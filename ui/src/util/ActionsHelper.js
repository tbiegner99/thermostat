export default (actions, prefix, key) => {
  actions[key] = `${prefix}.${key}`;
};

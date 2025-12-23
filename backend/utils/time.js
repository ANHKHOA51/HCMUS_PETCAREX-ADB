function timeFromEpoch(ms) {
  const d = new Date(ms);
  return {
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
    milliseconds: 0
  };
}
export { timeFromEpoch };
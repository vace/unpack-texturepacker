function queue() {
  let taskQueue = Promise.resolve()
  return function addQueue(task) {
    const result = taskQueue.then(task);
    taskQueue = result.catch(() => { });
    return result; 
  }
}

module.exports = {
  queue
}

const taskCenter = {
  status: 0,
  list: [],
  readyCallbacks: []
};

export const initTasks = tasks => {
  if (Array.isArray(tasks)) {
    tasks.forEach(task => task instanceof Promise && taskCenter.list.push(task));
  } else if (tasks instanceof Promise) {
    taskCenter.list.push(tasks);
  }
  if (taskCenter.list.length) {
    taskCenter.status = 1;
    Promise.all(taskCenter.list).then(res => {
      // console.log('@initTasks.then::', res);
      doReady();
    }).catch(err => {
      console.warn('@initTasks.catch::', err);
    }).finally(ret => {
      taskCenter.status = 0;
      taskCenter.list = [];
    });
  }
}

const doReady = () => {
  if (Array.isArray(taskCenter.readyCallbacks) && taskCenter.readyCallbacks.length) {
    let cb;
    while(taskCenter.readyCallbacks.length) {
      cb = taskCenter.readyCallbacks.shift();
      typeof cb == 'function' && cb();
    }
  } else if (typeof taskCenter.readyCallbacks == 'function') {
    taskCenter.readyCallbacks();
    taskCenter.readyCallbacks = [];
  }
}

export const onReady = callback => {
  if (typeof callback == 'function') {
    taskCenter.readyCallbacks.push(callback);
  }
  if (taskCenter.status === 0) doReady();
}

export default { initTasks, onReady };
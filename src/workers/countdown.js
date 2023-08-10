const WORKER_SIGNAL_STOP = '__WORKER_SIGNAL_STOP__';

worker.onMessage(time => {
  if (isNaN(time)) return console.warn('[Worker#Countdown.Inner]::参数错误', time), false;
  worker.postMessage(time);
  const timer = setInterval(() => {
    time--;
    worker.postMessage(time);
    if (time <= 0) {
      clearInterval(timer);
      worker.postMessage(WORKER_SIGNAL_STOP);
    }
  }, 1000);
});

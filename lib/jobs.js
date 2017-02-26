const debug = require('debug')('jobs') // eslint-disable-line no-unused-vars

export default function createExecutor (maxConcurrentRunners, execJob) {
  const scheduled = []
  let running = 0

  function jobDone () {
    debug('job done')
    running--
    maybeRunJobs()
  }

  function jobError (e) {
    debug('job error', e)
    console.error(e)
    jobDone()
  }

  function status () {
    debug('running %d, scheduled: %d', running, scheduled.length)
  }

  function maybeRunJobs () {
    while ((running < maxConcurrentRunners) && scheduled.length) {
      const job = scheduled.shift()
      execJob(job).then(jobDone, jobError)
      running++
    }

    status()
  }

  return {
    schedule (job, atBeginning = false) {
      debug('schedule', job, atBeginning)
      atBeginning ? scheduled.unshift(job) : scheduled.push(job)
      maybeRunJobs()
    }
  }
}

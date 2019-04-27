import { HooksFunctions, HooksFunctionsAsMiddleware } from './types'

/**
 * return a method decorators which will invoked the hooks like a common function
 * @param hooksBefore hooks that will be executed before the target function
 * @param hooksAfter hooks that will be executed after the target function
 */
function addSyncHooks(hooksBefore: HooksFunctions, hooksAfter: HooksFunctions) {
  return (
    _target,
    _key,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
  ) => {
    /**
     * store the original function, beacause we will call it later
     */
    const originalFunction = descriptor.value
    /**
     * wrap the original function, and execute the hooks
     */
    descriptor.value = function(...args: any[]) {
      /**
       * call hooks before
       */
      for (const hook of hooksBefore) {
        hook.call(this, ...args)
      }
      /**
       * call the original function with the arguments, and store the return value, because we'll return that later
       */
      const result = originalFunction.call(this, ...args)
      /**
       * calls hooks after
       */
      for (const hook of hooksAfter) {
        hook.call(this, ...args)
      }

      /**
       * return the result of invoked original method
       */
      return result
    }
    return descriptor
  }
}

/**
 * return a method decorators which will invoked the hooks like a middleware concept
 * @param hooksBefore hooks that will be executed before the target function
 * @param hooksAfter hooks that will be executed after the target function
 */
function addSyncHooksAsMiddleware(
  hooksBefore: HooksFunctionsAsMiddleware,
  hooksAfter: HooksFunctionsAsMiddleware
) {
  return (
    _target,
    _key,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) => {
    /**
     * store the original function, beacause we will call it later
     */
    const originalFunction = descriptor.value
    descriptor.value = (...args: any[]) => {
      /**
       * array that will be used for storing the proccess or function that
       * will be executed in sequence
       */
      let processes = []
      /**
       * value that will be used for storing value that returned from taget function/original function
       */
      let returnedValue = null
      /**
       * value that indicates where is the current process position in array `processes` above
       */
      let processPosition = 0
      /**
       * if this function invoked in hooks functions it will be
       * executed the next process, otherwise the next functions/process will not executed,
       * it's means that the process will be terminated/stopped
       * @param nextArgs params that will be passed for the next functions/process
       */
      const next = (...nextArgs) => {
        /**
         * `next` callback can't be called in the last process
         */
        if (processPosition !== processes.length - 1) {
          /**
           * increment the process position,
           * because we will executed the next process
           */
          processPosition++
          const nextProcess = processes[processPosition]
          /**
           * if `next` callback called without an argument so we will fill the argument with
           * the previous arguments
           */
          const nextArguments = nextArgs.length > 0 ? nextArgs : args
          if (nextProcess === originalFunction) {
            returnedValue = nextProcess.call(this, ...nextArguments)
            /**
             * if the next process is the target function / original function
             * we will call `next` callback manually, because we not provide `next` callback to the
             * original function
             */
            next(...nextArguments)
          } else {
            nextProcess.call(this, next, ...nextArguments)
          }
        }
      }
      /**
       * fill the process with combinations of `hooksBefore`,`original function`,`hooks after`
       */
      processes = processes.concat(hooksBefore)
      processes.push(originalFunction)
      processes = processes.concat(hooksAfter)
      /**
       * get the current process that will be executed
       */
      const process = processes[processPosition]

      /**
       * if the current process is orginal function then
       * we will not provides the `next` callback
       * and invoked `next` callback manually
       */
      if (process === originalFunction) {
        returnedValue = process.call(this, ...args)
        next(...args)
      } else {
        process.call(this, next, ...args)
      }

      return returnedValue
    }
  }
}

/**
 * add hooks to synchronous function
 * @remarks
 * this function will return a method decorators that will add hooks to the target function
 * @param hooksBefore array of hooks that will be invoked before the target function
 * @param hooksAfter array of hooks that will be invoked after the target function
 * @param asMiddleware boolean, if you set this params to `true` your hooks will
 * executed like middleware concept, otherwise your hooks will executed like a common function
 */
export function addHooks<T extends boolean>(
  hooksBefore: T extends true ? HooksFunctionsAsMiddleware : HooksFunctions,
  hooksAfter: T extends true ? HooksFunctionsAsMiddleware : HooksFunctions,
  asMiddleware: T
) {
  if (asMiddleware === true) {
    return addSyncHooksAsMiddleware(hooksBefore, hooksAfter)
  } else {
    return addSyncHooks(hooksBefore, hooksAfter)
  }
}

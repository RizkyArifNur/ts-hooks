import { HooksFunctions, HooksFunctionsAsMiddleware } from './types'

/**
 * add hooks to synchronous function
 * @remarks
 * this function will return a method decorators that will add hooks to the target function
 * there is two events : `AFTER` and `BEFORE`
 * events `AFTER` will execute the hooks after the target function is called
 * and events `BEFORE` will execute the hooks before the target function is called
 * @param events event when the hooks will called (`AFTER` | `BEFORE`)
 * @param hooks list of hooks
 */
function addSyncHooks(hooksBefore: HooksFunctions, hooksAfter: HooksFunctions) {
  return (
    _target,
    _key,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
  ) => {
    /**
     * store the previous method, beacause we will call it later
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
function addSyncHooksAsMiddleware(
  hooksBefore: HooksFunctionsAsMiddleware,
  hooksAfter: HooksFunctionsAsMiddleware
) {
  return (
    _target,
    _key,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) => {
    const originalFunction = descriptor.value
    descriptor.value = (...args: any[]) => {
      let processes = []
      let returnedValue = null
      let processPosition = 0

      const next = (...nextArgs) => {
        if (processPosition !== processes.length - 1) {
          processPosition++
          const currentProcess = processes[processPosition]
          const nextArguments = nextArgs.length > 0 ? nextArgs : args
          if (currentProcess === originalFunction) {
            returnedValue = currentProcess.call(this, ...nextArguments)
            next(...nextArguments)
          } else {
            currentProcess.call(this, next, ...nextArguments)
          }
        }
      }
      processes = processes.concat(hooksBefore)
      processes.push(originalFunction)
      processes = processes.concat(hooksAfter)
      const process = processes[processPosition]
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

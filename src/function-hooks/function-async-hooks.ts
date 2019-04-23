import { Events } from './event'

/**
 * add hooks to asynchronous function
 * @remarks
 * this function will return a method decorators that will add hooks to the target function
 * there is two events : `AFTER` and `BEFORE`
 * events `AFTER` will execute the hooks after the target function is called
 * and events `BEFORE` will execute the hooks before the target function is called
 * @param events event when the hooks will called (`AFTER` | `BEFORE`)
 * @param hooks list of hooks
 */
export function addAsyncHooks(
  events: Events,
  ...hooks: Array<(...args: any[]) => any>
) {
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
    descriptor.value = async function(...args: any[]) {
      /**
       * if the selected event is `AFTER` then we will execute the hooks before we call the original function
       */
      if (events === 'BEFORE') {
        for (const hook of hooks) {
          await hook.call(this, ...args)
        }
      }
      /**
       * call the original function with the arguments, and store the return value, because we'll return that later
       */
      const result = await originalFunction.call(this, ...args)
      /**
       * if the selected event is `BEFORE` then we will execute the hooks after we call the original function
       */
      if (events === 'AFTER') {
        for (const hook of hooks) {
          await hook.call(this, ...args)
        }
      }

      /**
       * return the result of invoked original method
       */
      return result
    }
    return descriptor
  }
}

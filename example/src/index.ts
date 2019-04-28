import { addAsyncHooks, addHooks } from 'ts-hooks'
import {
  firstAsyncHook,
  firstSyncHook,
  hookAsMiddleware,
  hookWithError,
  hookWithParams,
  secondSyncHook
} from './hooks'
class TryHooks {
  /**
   * add hooks before target function called
   * NOTE : you can pass the Async hooks to the sync function, but
   * your hooks will not awaited
   * the first argument is array of hooks that will be called before the original function called
   * the second argument is array of hooks that will be called after the original function called
   * the last argument is optional, if you set it to `true` then the hooks function will
   * executed like middleware, otherwise the hooks will executed like common function
   */
  @addHooks([firstSyncHook], [], false)
  syncFunctionsWithHookBefore() {
    console.log(
      'this is the target function with single hook before this function called'
    )
  }

  /**
   * add hooks after target function called
   */
  @addHooks([], [firstSyncHook], false)
  syncFunctionWithHookAfter() {
    console.log(
      'this is the target function with single hook after this function called'
    )
  }

  /**
   * add multiple hooks as much as you want,
   * the ordering are matters
   * in this case, `firstSyncHook` will executed first and after it done
   * the `secondSyncHook` will be executed
   */
  @addHooks([firstSyncHook, secondSyncHook], [], false)
  syncFunctionWithMultipleHooks() {
    console.log('this is the target function with multiple hooks')
  }

  /**
   * you can pass params just like a common functions
   * and your hooks will have same params like the target function
   */
  @addHooks([hookWithParams], [], false)
  functionWithHooksAndParams(param1: string, param2: number) {
    console.log(
      `this is the target function with hooks and params :{${param1} ${param2}} `
    )
  }

  /**
   * if your hooks are throwing an error, the next step will not executed
   * because hooks are run synchronously
   */
  @addHooks([hookWithError], [], false)
  functionWithErrorHook() {
    console.log('This statement will not executed')
  }

  /**
   * you can also handle the async function with hooks,
   * and you can also pass the sync or Async hook to the Async function
   * it will work fine :D
   */
  @addAsyncHooks([firstAsyncHook], [], false)
  async functionWithAsyncHook() {
    console.log('Yeay we can handle async function too :D !!')
  }

  /**
   * this function are same like the Async function above
   */
  @addAsyncHooks([firstAsyncHook], [], false)
  functionWhichReturnPromise() {
    return new Promise(resolve => {
      setTimeout(() => resolve('Yeay we can handle this too !!'))
    })
  }

  @addHooks([hookAsMiddleware], [], true)
  functionWithHookAsMiddleware(param1: string) {
    console.log('this is origin function with params : ', param1)
  }
}

const tryHooks = new TryHooks()
/**
 * and you can call it like a common function
 */
tryHooks.functionWithHookAsMiddleware('origin params')

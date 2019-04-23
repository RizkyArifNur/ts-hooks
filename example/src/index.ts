import { addAsyncHooks, addHooks } from 'ts-hooks'
import {
  firstAsyncHook,
  firstSyncHook,
  hookWithError,
  hookWithParams,
  secondSyncHook
} from './hooks'
class TryHooks {
  /**
   * add hooks before target function called
   * NOTE : you can pass the Async hooks to the sync function, but
   * your hooks will not awaited
   */
  @addHooks('BEFORE', firstSyncHook)
  syncFunctionsWithHookBefore() {
    console.log(
      'this is the target function with single hook before this function called'
    )
  }

  /**
   * add hooks after target function called
   */
  @addHooks('AFTER', firstSyncHook)
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
  @addHooks('BEFORE', firstSyncHook, secondSyncHook)
  syncFunctionWithMultipleHooks() {
    console.log('this is the target function with multiple hooks')
  }

  /**
   * you can pass params just like a common functions
   * and your hooks will have same params like the target function
   */
  @addHooks('BEFORE', hookWithParams)
  functionWithHooksAndParams(param1: string, param2: number) {
    console.log(
      `this is the target function with hooks and params :{${param1} ${param2}} `
    )
  }

  /**
   * if your hooks are throwing an error, the next step will not executed
   * because hooks are run synchronously
   */
  @addHooks('BEFORE', hookWithError)
  functionWithErrorHook() {
    console.log('This statement will not executed')
  }

  /**
   * you also can handle the async function with hooks,
   * and you also can pass the sync or Async hook to the Async function
   * it will work fine :D
   */
  @addAsyncHooks('BEFORE', firstAsyncHook)
  async functionWithAsyncHook() {
    console.log('Yeay we can handle async function too :D !!')
  }

  /**
   * this function are same like the Async function above
   */
  @addAsyncHooks('BEFORE', firstAsyncHook)
  functionWithReturnPromise() {
    return new Promise(resolve => {
      setTimeout(() => resolve('Yeay we can handle this too !!'))
    })
  }
}

const tryHooks = new TryHooks()
// trySyncHooks.syncFunctionsWithHookBefore('first params')

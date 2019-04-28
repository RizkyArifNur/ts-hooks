import { Next } from 'ts-hooks'

export function firstSyncHook() {
  console.log('this is first synchronous hooks')
}

export function secondSyncHook() {
  console.log('this is second synchronous hooks')
}

export function hookWithParams(param1: string, param2: number) {
  console.log(`this is synchronous hooks with params:{ ${param1} ${param2} }`)
}

export function hookWithError() {
  console.log('this is hook with throw an error')
  throw new Error('Just an Error')
}

/**
 * remember that the first param of hook in middleware concept is always
 * `next`, and the next params is depends to the target function
 * @param next callback function, if you invoked this callback then the next process will be executed
 * otherwise the next process will not be executed
 * @param param1 this param is depend to the target function
 */
export function hookAsMiddleware(next: Next, param1: string) {
  console.log(
    'this is hook function that implement middleware concept with params : ',
    param1
  )
  /**
   * you can override the params that will be retrieved in the next process/function
   */
  next('override params from hooks')
}

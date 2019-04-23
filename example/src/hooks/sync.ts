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

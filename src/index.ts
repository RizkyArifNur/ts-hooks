import { addAsyncHooks, addHooks } from './function-hooks'
import { Next } from './function-hooks/types'

export * from './function-hooks'

class TryHooks {
  @addHooks([firstHooks], [secondHooks, firstHooks], true)
  tryNewHooks(coba: any) {
    console.log('origin invoked')
    return 'this is returned value from origin with params ' + coba
  }

  @addAsyncHooks([firstAsyncHooks], [], true)
  async tryNewAsyncHooks(coba: string) {
    console.log('origin invoked')
    return 'this is returned from origin async hooks with params ' + coba
  }
}

function firstAsyncHooks(_next: Next, coba: any) {
  console.log('this is first async hooks with params', coba)
  return new Promise((_resolve, _reject) => {
    setTimeout(() => {
      _reject(new Error('hehe'))
      _next('hoho')
    }, 2000)
  })
}

async function tryAsync() {
  return new Promise(resolve => {
    setTimeout(() => resolve('hehe'), 2000)
  })
}

function firstHooks(_next: Next, coba: any) {
  console.log('this is first hooks with params', coba)
  // _next('hehe')
}

function secondHooks(next, coba: any) {
  console.log('this is second hooks with params', coba)
  next('wewew')
}
const tryHooks = new TryHooks()
// console.log(tryHooks.tryNewHooks('i dont know'))
tryHooks
  .tryNewAsyncHooks('hehe')
  .then(result => console.log('returned value is', result))
  .catch(err => console.log(err))
// tryAsync().then(result => console.log(result))

# ts-hooks

Hooks as you want

> Documentation for TS-Hooks

Create your own hooks like add validation before some function called, or trigger some stuff when the function called
in every code as you want

## Installation

### NPM

`npm install ts-hooks`

### Yarn

`yarn add ts-hooks`

## Features

- add hooks before function called
- add hooks after function called
- support multiple hooks
- support for async function

## Basic Concept

Idea behind **ts-hooks** is to wrap your function into wrapper function, are you confuse ? yeah me too :D ,
don't worry, let's see the example below

**Your function before wrapped**

```typescript
function iDontKnowTheName() {
  console.log("Hey i don't what should i do!")
}
```

**Your function after wrapped by ts-hooks**

```typescript
function functionWrapper() {
  hooksBefore()
  const result = iDontKnowTheName()
  hooksAfter()
  return result
}
```

## Basic Usage

if you're not understand with the basic concept above, don't worry just forget it,
let's see how to use the **ts-hooks**

> :warning: **Important!** ts-hooks can be used only when your functions are inside a class

### add hook before your target function called

```typescript
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
```

and the **firstSyncHook** must be a function like this

```typescript
function firstSyncHook() {
  console.log('this is first synchronous hooks')
}
```

### add hook after your target function called

```typescript
  /**
   * add hooks after target function called
   */
  @addHooks([], [firstSyncHook], false)
  syncFunctionWithHookAfter() {
    console.log(
      'this is the target function with single hook after this function called'
    )
  }
```

### add multiple hooks

```typescript
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
```

### pass arguments to target function

```typescript
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
```

and the **hookWithParam** must be a function like this

```typescript
function hookWithParams(param1: string, param2: number) {
  console.log(`this is synchronous hooks with params:{ ${param1} ${param2} }`)
}
```

### hooks that will throw an Error?

```typescript
  /**
   * if your hooks are throwing an error, the next step will not executed
   * because hooks are run synchronously
   */
  @addHooks([hookWithError], [], false)
  functionWithErrorHook() {
    console.log('This statement will not executed')
  }
```

## Basic usage for async function

We can add some hooks to async function too, yeay !

```typescript
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
}
```

## Middleware concept

> :warning: Warning !!! this features maybe unstable

ts-hooks v.0.1.0-rc3 is already support the middleware concept, you can use it like middleware in express.js (see [express middleware](https://expressjs.com/en/guide/using-middleware.html))
the middleware concept will provide a **next callback** to your hooks function, if in your hooks function you called the **next()** callback it will execute the next process/function depends on the process/function stack

### Example usage

if you set your hooks like this

```typescript
  @addHooks([hookAsMiddleware], [], true)
  functionWithHookAsMiddleware(param1: string) {
    console.log('this is origin function with params : ', param1)
  }
```

then the **hookAsMiddleware** must be a function like this

```typescript
/**
 * import next type from `ts-hooks`
 */
import { Next } from 'ts-hooks'
/**
 * remember that the first param of hook in middleware concept is always
 * `next`, and the next params is depends to the target function
 *
 * @param next callback function, if you invoked this callback, then the next process will be executed
 * otherwise the next process will not be executed
 * @param param1 this param is depend to the target function
 */
function hookAsMiddleware(next: Next, param1: string) {
  console.log(
    'this is hook function that implement middleware concept with params : ',
    param1
  )
  /**
   * you can override the params that will be retrieved in the next process/function
   */
  next('override params from hooks')
}
```

and if you execute it, it should be like this

```
this is hook function that implement middleware concept with params :  origin params
this is origin function with params :  override params from hooks
```

## Process stack

**ts-hooks** has a process stack or sequence of processes that will be executed,
and it will be like this

```
firstHooksBefore  <- if this error, then the next process(secondHooksBefore, originFunction, etc) will not be executed, and returned value will be undefined/null
secondHooksBefore
originFunction
firstHooksAfter
secondHooksAfter
```

if you're using the middleware concept, the process stack will be like this

```
firstHooksBefore  <- if this error or the next() callback is not called, then the next process(secondHooksBefore, originFunction, etc) will not be executed, and returned value will be undefined/null
secondHooksBefore
originFunction
firstHooksAfter
secondHooksAfter
```

for full example you can look at the [example](https://github.com/RizkyArifNur/ts-hooks/tree/master/example) folder in this repository,

hope this repository can help you guys :blush:

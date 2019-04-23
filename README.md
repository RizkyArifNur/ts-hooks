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
   * the first argument are event (AFTER | BEFORE)
   * the next argument are hooks function that will be called (REST params)
   */
  @addHooks('BEFORE', firstSyncHook)
  syncFunctionsWithHookBefore() {
    console.log(
      'this is the target function with single hook before this function called'
    )
  }
```

### add hook after your target function called

```typescript
  /**
   * add hooks after target function called
   */
  @addHooks('AFTER', firstSyncHook)
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
   * the ordering of the hooks are matter
   * in this case, `firstSyncHook` will executed first and after it done
   * the `secondSyncHook` will be executed
   */
  @addHooks('BEFORE', firstSyncHook, secondSyncHook)
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
  @addHooks('BEFORE', hookWithParams)
  functionWithHooksAndParams(param1: string, param2: number) {
    console.log(
      `this is the target function with hooks and params :{${param1} ${param2}} `
    )
  }
```

### hooks that will throw an Error?

```typescript
  /**
   * if your hooks are throwing an error, the next step will not executed
   * because hooks are run synchronously
   */
  @addHooks('BEFORE', hookWithError)
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
  @addAsyncHooks('BEFORE', firstAsyncHook)
  async functionWithAsyncHook() {
    console.log('Yeay we can handle async function too :D !!')
  }

  /**
   * this function are same like the Async function above
   */
  @addAsyncHooks('BEFORE', firstAsyncHook)
  functionWhichReturnPromise() {
    return new Promise(resolve => {
      setTimeout(() => resolve('Yeay we can handle this too !!'))
    })
  }
}
```

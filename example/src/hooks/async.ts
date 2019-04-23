export function firstAsyncHook() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('this is the first async hook')

      resolve()
    }, 1000)
  })
}

export function secondAsyncHook() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('this is the second async hook')

      resolve()
    }, 1000)
  })
}

export function thirdAsyncHookWithError() {
  return new Promise((_resolve, reject) => {
    setTimeout(() => {
      console.log('this is the third async hook that will throw an error')
      reject()
    }, 1000)
  })
}

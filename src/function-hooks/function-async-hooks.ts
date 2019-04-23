import { Events } from './event'

export function addAsyncHooks(hook: (...args: any[]) => any, events: Events) {
  return (
    _target,
    _key,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) => {
    const originalFunction = descriptor.value
    descriptor.value = async function(...args: any[]) {
      if (events === 'BEFORE') await hook.call(this, ...args)
      const result = originalFunction.call(this, ...args)
      if (events === 'AFTER') await hook.call(this, ...args)
      return result
    }
    return descriptor
  }
}

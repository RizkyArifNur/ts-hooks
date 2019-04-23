import { Events } from './event'

export function addHooks(hook: (...args: any[]) => any, events: Events) {
  return (
    _target,
    _key,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) => {
    const originalFunction = descriptor.value
    descriptor.value = function(...args: any[]) {
      if (events === 'BEFORE') hook.call(this, ...args)
      const result = originalFunction.call(this, ...args)
      if (events === 'AFTER') hook.call(this, ...args)
      return result
    }
    return descriptor
  }
}

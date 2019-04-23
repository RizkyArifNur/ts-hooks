import { Events } from './event'

export function addHooks(
  events: Events,
  ...hooks: Array<(...args: any[]) => any>
) {
  return (
    _target,
    _key,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) => {
    const originalFunction = descriptor.value
    descriptor.value = function(...args: any[]) {
      if (events === 'BEFORE') {
        for (const hook of hooks) {
          hook.call(this, ...args)
        }
      }
      const result = originalFunction.call(this, ...args)
      if (events === 'AFTER') {
        for (const hook of hooks) {
          hook.call(this, ...args)
        }
      }
      return result
    }
    return descriptor
  }
}

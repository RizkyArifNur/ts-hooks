export type Events = 'BEFORE' | 'AFTER'

export interface IAddHooksParams {
  before: HooksFunctionsAsMiddleware
  after: HooksFunctionsAsMiddleware
}

export interface IAddHooksParamsAsMiddleware {
  before: HooksFunctions
  after: HooksFunctions
}
export type HooksFunctions = Array<(...args: any[]) => any>
export type HooksFunctionsAsMiddleware = Array<
  (next: Next, ...args: any[]) => any
>
export type Next = (...args: any[]) => Promise<any>

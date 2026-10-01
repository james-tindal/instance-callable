export const call = Symbol('instance-callable.call')

export interface Callable<Arguments extends unknown[], Result> {
  (...argumentsList: Arguments): Result
  apply(thisArgument: this, argumentsList: Arguments): Result
  bind(thisArgument: this): (...argumentsList: Arguments) => Result
  call(thisArgument: this, ...argumentsList: Arguments): Result
}

export abstract class Callable<Arguments extends unknown[], Result> extends Function {
  constructor() {
    super()

    const callable = function(
      this: Callable<Arguments, Result> | undefined,
      ...argumentsList: Arguments
    ): Result {
      return callableInstance[call].apply(this ?? callableInstance, argumentsList)
    }
    const callableInstance = callable as Callable<Arguments, Result>
    Object.setPrototypeOf(callable, new.target.prototype)

    const implementation = new.target.prototype[call] as Function
    Object.defineProperties(callable, {
      length: { value: implementation.length },
      name: { value: new.target.name },
    })

    return callableInstance
  }

  protected abstract [call](...argumentsList: Arguments): Result
}

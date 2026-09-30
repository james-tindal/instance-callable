export interface Callable<Arguments extends unknown[], Result> {
  (...argumentsList: Arguments): Result
  apply(thisArgument: unknown, argumentsList: Arguments): Result
  bind(thisArgument: unknown): (...argumentsList: Arguments) => Result
}

export abstract class Callable<Arguments extends unknown[], Result> extends Function {
  constructor() {
    super()

    const callable = function(this: unknown, ...argumentsList: Arguments): Result {
      return callable.call(this, ...argumentsList)
    }
    Object.setPrototypeOf(callable, new.target.prototype)

    const implementation = new.target.prototype.call as Function
    Object.defineProperties(callable, {
      length: { value: Math.max(0, implementation.length - 1) },
      name: { value: new.target.name },
    })

    return callable
  }

  abstract override call(thisArgument: unknown, ...argumentsList: Arguments): Result
}

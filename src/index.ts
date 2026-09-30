export interface Callable<Arguments extends unknown[], Result> {
  (...argumentsList: Arguments): Result
}

export abstract class Callable<Arguments extends unknown[], Result> extends Function {
  constructor() {
    super()

    return new Proxy(this, {
      apply: (target, thisArgument, argumentsList) =>
        target.call(thisArgument, ...argumentsList as Arguments),
    })
  }

  abstract override call(thisArgument: unknown, ...argumentsList: Arguments): Result
}

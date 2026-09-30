import { describe, expect, expectTypeOf, it } from 'vite-plus/test'

import { Callable } from '.'

class Counter extends Callable<[amount: number], number> {
  value = 0

  get doubled() {
    return this.value * 2
  }

  override call(_thisArgument: unknown, amount: number) {
    this.value += amount
    return this.value
  }
}

class ReceiverCallable extends Callable<[suffix: string], string> {
  override call(thisArgument: { prefix: string }, suffix: string) {
    return `${thisArgument.prefix}:${suffix}`
  }
}

describe('Callable', () => {
  it('makes subclass instances directly callable', () => {
    const counter = new Counter()

    expect(counter(2)).toBe(2)
    expect(counter(3)).toBe(5)
  })

  it('supports explicit Function.call invocation', () => {
    const callable = new ReceiverCallable()

    expect(callable.call({ prefix: 'value' }, 'suffix')).toBe('value:suffix')
  })

  it('preserves subclass state, methods, and accessors', () => {
    const counter = new Counter()

    counter(4)

    expect(counter.value).toBe(4)
    expect(counter.doubled).toBe(8)
  })

  it('preserves the subclass and Function prototype chains', () => {
    const counter = new Counter()

    expect(counter).toBeInstanceOf(Counter)
    expect(counter).toBeInstanceOf(Callable)
    expect(counter).toBeInstanceOf(Function)
  })

  it('can be passed and invoked as a detached function', () => {
    const counter = new Counter()
    const invoke = (callback: (amount: number) => number) => callback(5)

    expect(invoke(counter)).toBe(5)
    expect(counter.value).toBe(5)
  })
})

void function verifyTypes(): void {
  const counter = new Counter()
  const receiver = new ReceiverCallable()

  expectTypeOf(counter).toBeCallableWith(1)
  expectTypeOf(counter(1)).toEqualTypeOf<number>()
  expectTypeOf(receiver.call({ prefix: 'value' }, 'suffix')).toEqualTypeOf<string>()

  // @ts-expect-error The callable requires a number argument.
  counter('1')

  // @ts-expect-error The explicit receiver requires a prefix.
  receiver.call({}, 'suffix')
}

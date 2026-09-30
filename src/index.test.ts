import { describe, expect, expectTypeOf, it } from 'vite-plus/test'

import { Callable } from '.'

class AsyncCallable extends Callable<[value: number], Promise<number>> {
  async call(_thisArgument: unknown, value: number) {
    return value * 2
  }
}

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

class DerivedCounter extends Counter {
  decrement(amount: number) {
    return this(-amount)
  }
}

class InitialisedCallable extends Callable<[suffix: string], string> {
  constructor(readonly prefix: string) {
    super()
  }

  override call(_thisArgument: unknown, suffix: string) {
    return `${this.prefix}:${suffix}`
  }

  describe() {
    return `callable:${this.prefix}`
  }
}

class ReceiverCallable extends Callable<[amount: number], number> {
  value = 0

  override call(thisArgument: this, amount: number) {
    thisArgument.value += amount
    return thisArgument.value
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
    const receiver = new ReceiverCallable()

    expect(callable.call(receiver, 2)).toBe(2)
    expect(callable.value).toBe(0)
    expect(receiver.value).toBe(2)
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

  it('supports Function.apply', () => {
    const callable = new ReceiverCallable()
    const receiver = new ReceiverCallable()

    expect(callable.apply(receiver, [3])).toBe(3)
    expect(callable.value).toBe(0)
    expect(receiver.value).toBe(3)
  })

  it('supports Function.bind', () => {
    const callable = new ReceiverCallable()
    const receiver = new ReceiverCallable()
    const bound = callable.bind(receiver)

    expect(bound(4)).toBe(4)
    expect(callable.value).toBe(0)
    expect(receiver.value).toBe(4)
  })

  it('preserves constructor arguments and initialized fields', () => {
    const callable = new InitialisedCallable('prefix')

    expect(callable('value')).toBe('prefix:value')
    expect(callable.prefix).toBe('prefix')
  })

  it('keeps independent state for each instance', () => {
    const first = new Counter()
    const second = new Counter()

    expect(first(2)).toBe(2)
    expect(second(5)).toBe(5)
    expect(first.value).toBe(2)
    expect(second.value).toBe(5)
  })

  it('supports further callable subclass inheritance', () => {
    const counter = new DerivedCounter()

    expect(counter(5)).toBe(5)
    expect(counter.decrement(2)).toBe(3)
    expect(counter).toBeInstanceOf(DerivedCounter)
    expect(counter).toBeInstanceOf(Counter)
  })

  it('uses the subclass name and callable arity as function metadata', () => {
    const counter = new Counter()
    const derivedCounter = new DerivedCounter()

    expect(counter.name).toBe('Counter')
    expect(counter.length).toBe(1)
    expect(derivedCounter.name).toBe('DerivedCounter')
    expect(derivedCounter.length).toBe(1)
  })

  it('passes the invocation receiver to call', () => {
    const callable = new ReceiverCallable()
    const receiver = new ReceiverCallable()

    expect(Reflect.apply(callable, receiver, [5])).toBe(5)
    expect(callable.value).toBe(0)
    expect(receiver.value).toBe(5)
  })

  it('retains ordinary subclass methods', () => {
    const callable = new InitialisedCallable('prefix')

    expect(callable.describe()).toBe('callable:prefix')
  })
})

void function verifyTypes(): void {
  const counter = new Counter()
  const receiver = new ReceiverCallable()

  expectTypeOf(counter).toBeCallableWith(1)
  expectTypeOf(counter(1)).toEqualTypeOf<number>()
  expectTypeOf(receiver.call(receiver, 1)).toEqualTypeOf<number>()
  expectTypeOf(receiver.apply(receiver, [1])).toEqualTypeOf<number>()
  expectTypeOf(receiver.bind(receiver)).toEqualTypeOf<(amount: number) => number>()
  expectTypeOf(new AsyncCallable()(1)).toEqualTypeOf<Promise<number>>()

  // @ts-expect-error The callable requires a number argument.
  counter('1')

  // @ts-expect-error The explicit receiver must be a ReceiverCallable.
  receiver.call({}, 1)
}

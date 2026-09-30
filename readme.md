# extend-callable

Create strongly typed callable class instances.

## Install

```sh
pnpm add extend-callable
```

## Usage

Extend `Callable` with the argument tuple and return type. Implement a
`Function.call`-compatible method.

```ts
import { Callable } from 'extend-callable'

class Counter extends Callable<[amount: number], number> {
  value = 0

  override call(_thisArgument: unknown, amount: number) {
    this.value += amount
    return this.value
  }
}

const counter = new Counter()

counter(2) // 2
counter(3) // 5
counter.value // 5
```

Direct calls and explicit `Function.call` calls use the same implementation:

```ts
class Formatter extends Callable<[value: string], string> {
  override call(thisArgument: { prefix: string }, value: string) {
    return `${thisArgument.prefix}:${value}`
  }
}

const format = new Formatter()
format.call({ prefix: 'id' }, '123') // "id:123"
```

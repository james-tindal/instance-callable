# extend-callable

Create classes whose instances are **callable**.

## Install

```sh
pnpm add extend-callable
```

## Usage

Extend `Callable` and override `call`

```ts
import { Callable } from 'extend-callable'

class Counter extends Callable<[amount: number], number> {
  value = 0

  override call(thisArg: this, amount: number) {
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

## Function properties

Callable instances are functions. They retain the standard function members:

- `name`
- `length`
- `prototype`
- `call`
- `apply`
- `bind`
- `arguments`
- `caller`

Do not reuse these names for unrelated subclass fields or methods. Own function
properties such as `name`, `length`, and `prototype` can block field assignment.
Inherited methods such as `apply` and `bind` can be shadowed and stop behaving
like standard function methods. `arguments` and `caller` also have restricted
legacy behavior.

`call` is the intentional exception. Subclasses override it to implement the
callable operation. Its first argument is the callable instance that receives
the invocation, followed by the callable arguments.

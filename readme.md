# instance-callable

Create classes whose instances are **callable**.

## Install

```sh
pnpm add instance-callable
```

## Usage

Extend `Callable` and override `[call]`.

```ts
import { call, Callable } from 'instance-callable'

class Counter extends Callable<[amount: number], number> {
  value = 0

  override [call](amount: number) {
    this.value += amount
    return this.value
  }
}

const counter = new Counter()

counter(2) // 2
counter(3) // 5
counter.value // 5
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
Inherited methods such as `call`, `apply`, and `bind` can be shadowed and stop
behaving like standard function methods. `arguments` and `caller` also have
restricted legacy behavior.

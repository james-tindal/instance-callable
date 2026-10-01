import { call, Callable } from 'instance-callable'

class Add extends Callable<[left: number, right: number], number> {
  override [call](left: number, right: number) {
    return left + right
  }
}

const add = new Add()

if (add(2, 3) !== 5)
  throw new Error('Packaged callable returned the wrong result')

const result: number = add.call(add, 2, 3)
void result

// @ts-expect-error Packaged declarations must reject invalid arguments.
add('2', 3)

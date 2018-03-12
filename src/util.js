import { compose, curry, head, prop } from 'ramda'
import { fromNullable } from 'folktale/maybe'

export const safeHead = compose(fromNullable, head)
export const safeProp = curry(compose(fromNullable, prop))
export const defaultTo = curry((def, m) => m.getOrElse(def))
export const defaultNullableTo = def => compose(defaultTo(def), fromNullable)

export function pureLog (x) {
  console.log(x)
  return x
}

const R = require('ramda')
const { chain, compose, curry, filter, map, head, prop, sortBy } = R
const { fromNullable } = require('folktale/maybe')
const { defaultTo, safeProp } = require('./util')
const html = require('bel')
const Nanocomponent = require('nanocomponent')

export default function Table () {
  if (!(this instanceof Table)) return new Table()
  Nanocomponent.call(this)
}

const toTd = i => html`<td>${i}</td>`

const getColumnConfig = compose(defaultTo([]), chain(safeProp('columns')), fromNullable)

const headers = compose(
  map(compose(toTd, prop('displayName')))
  , getColumnConfig
)
const getterFromDisplayName = compose(
  x => i => i[x]
  , prop('displayName')
)

const accessorFor = col => compose(
  defaultTo(getterFromDisplayName(col))
  , safeProp('accessor')
)(col)

const accessorForByName = curry(
  (name, config) =>
    compose(
      accessorFor
      , columnByName(name)
    )(config)
)

const liFromItem = curry((config, item) => {
  const columns = getColumnConfig(config)

  const dataCols = map(
    compose(
      toTd
      , x => x(item)
      , accessorFor
    )
  )

  return html`<tr>${dataCols(columns)}</tr>`
})

const columnByName = curry((name, config) => {
  return compose(
    head
    , filter(a => a.displayName === name)
    , getColumnConfig
  )(config)
})

const toListItems = curry((config, sortAttr, items) => {
  return compose(
    map(liFromItem(config))
    , sortBy(accessorForByName(sortAttr, config))
  )(items)
})

const renderFn = (items, config, sortAttr) => html`
<table>
  <thead>
    <tr>${headers(config)}</tr>
  </thead>
  ${toListItems(config, sortAttr, items)}
</table>
`
const updateFn = () => false

Table.prototype = Object.create(Nanocomponent.prototype)
Table.prototype.createElement = renderFn
Table.prototype.update = updateFn

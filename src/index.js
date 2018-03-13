const R = require('ramda')
const { chain, compose, curry, filter, identity, map, head, prop, reverse, sortBy, set, lensProp, __ } = R
const { fromNullable } = require('folktale/maybe')
const { defaultTo, safeProp, noop } = require('./util')
const html = require('bel')
const Nanocomponent = require('nanocomponent')

export default function Table () {
  if (!(this instanceof Table)) return new Table()
  Nanocomponent.call(this)
}

const toTd =
      (config) => {
        return html`<td onclick=${config.onClick || noop}>${config.text}</td>`
      }

const setText = set(lensProp('text'))
const setOnClick = set(lensProp('onClick'))

const toHeaderTd = curry((sortSetter, col) => {
  const colName = prop('displayName', col)
  return compose(
    toTd
    , setOnClick(() => sortSetter(colName))
    , setText(__, {})
  )(colName)
})

const getColumnConfig = compose(
  defaultTo([]),
  chain(safeProp('columns')),
  fromNullable)

const headers = curry((sortSetter, config) => compose(
  map(toHeaderTd(sortSetter))
  , getColumnConfig
)(config))

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
      , set(lensProp('text'), __, {})
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

const toListItems = curry((config, sortAttr, items, reverser) => {
  return compose(
    map(liFromItem(config))
    , reverser
    , sortBy(accessorForByName(sortAttr, config))
  )(items)
})

const renderFn = function (items, config, sortAttr, shouldReverse) {
  this.sortAttr = sortAttr
  this.shouldReverse = shouldReverse

  const setSort = function (sort) {
    this.render(items, config, sort, this.sortAttr === sort ? !this.shouldReverse : this.shouldReverse)
  }

  return html`
    <table>
      <thead>
        <tr>${headers(setSort.bind(this), config)}</tr>
      </thead>
      ${toListItems(config, sortAttr, items, this.shouldReverse ? reverse : identity)}
    </table>
  `
}

const updateFn = function (items, config, sortAttr, shouldReverse) {
  return sortAttr !== this.sortAttr || shouldReverse !== this.shouldReverse
}

Table.prototype = Object.create(Nanocomponent.prototype)
Table.prototype.createElement = renderFn
Table.prototype.update = updateFn

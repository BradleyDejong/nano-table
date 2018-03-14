const R = require('ramda')
const css = require('sheetify')
const { chain, compose, curry, filter, identity, map, head, prop, reverse, sortBy, set, lensProp, __ } = R
const { fromNullable } = require('folktale/maybe')
const { defaultTo, safeProp, noop } = require('./util')
const html = require('bel')
const Nanocomponent = require('nanocomponent')

const toTd = (config) => html`<td class="${config.cssClass || ''}" onclick=${config.onClick || noop}>${config.text}</td>`

// setText :: String -> Object -> Object
const setText = set(lensProp('text'))

// setText :: Function -> Object -> Object
const setOnClick = set(lensProp('onClick'))

const baseHeaderTdStyles = css('./header-td.css')

const headerStyle = curry(
  (col, currentSort, isReversed) => {
    const base = baseHeaderTdStyles
    const direction = isReversed ? 'descending' : 'ascending'
    return prop('displayName', col) === currentSort ? `${direction} ${base}` : base
  }
)

// toHeaderTd :: SortHandler -> ColumnConfig -> DOMElement
const toHeaderTd = curry((sortSetter, currentSort, isReversed, col) => {
  const colName = prop('displayName', col)

  const buildTd = compose(
    toTd
    , set(lensProp('cssClass'), headerStyle(col, currentSort, isReversed))
    , setOnClick(() => sortSetter(colName))
    , setText(__, {})
  )

  return buildTd(colName)
})

// getColumnConfig :: TableConfig -> Array ColumnConfig
const getColumnConfig = compose(
  defaultTo([]),
  chain(safeProp('columns')),
  fromNullable)

// headers :: SortHandler -> String -> TableConfig -> Array DOMElement
const headers = curry((sortSetter, currentSort, isReversed, config) => compose(
  map(toHeaderTd(sortSetter, currentSort, isReversed))
  , getColumnConfig
)(config))

// getterFromDisplayName :: ColumnConfig -> (Object -> ColumnData)
const getterFromDisplayName = compose(
  x => i => i[x]
  , prop('displayName')
)

// viewFor :: ColumnConfig -> (Object -> InnerHTML)
const viewFor = col => compose(
  defaultTo(stringView(getterFromDisplayName(col)))
  , safeProp('view')
)(col)

// accessorFor :: ColumnConfig -> (Object -> ColumnData)
const accessorFor = col => compose(
  defaultTo(getterFromDisplayName(col))
  , safeProp('accessor')
)(col)

// accessorForByName :: String -> TableConfig -> (Object -> ColumnData)
const accessorForByName = curry(
  (name, config) =>
    compose(
      accessorFor
      , columnByName(name)
    )(config)
)

export const stringView = accessor => curry(
  (item) => compose(
    toTd
    , set(lensProp('text'), __, {})
  )(accessor(item))
)

// liFromItem :: TableConfig -> Object -> DOMElement
const liFromItem = curry((config, item) => {
  const columns = getColumnConfig(config)

  const dataCols = map(
    compose(
      x => x(item)
      , viewFor
    )
  )

  return html`<tr>${dataCols(columns)}</tr>`
})

// columnByName :: String -> TableConfig -> ColumnConfig
const columnByName = curry((name, config) => {
  return compose(
    head
    , filter(a => a.displayName === name)
    , getColumnConfig
  )(config)
})

const sortByForCol = curry(
  (config, sortAttr) =>
    compose(
      sortBy
      , defaultTo(accessorForByName(sortAttr, config))
      , safeProp('sortValue')
      , columnByName(sortAttr)
    )(config)
)

// toListItems :: TableConfig -> String -> Array Object -> (Array a -> Array a) -> Array DOMElement
const toListItems = curry((config, sortAttr, items, reverser) => {
  return compose(
    map(liFromItem(config))
    , reverser
    , sortByForCol(config, sortAttr)
  )(items)
})

// IMPURE STUFF -------------------------- (icky class-like nonsense)

const renderFn = function ({items, config, sortAttr, shouldReverse}) {
  this.sortAttr = sortAttr
  this.shouldReverse = shouldReverse || false;


  const setSort = function (sort) {
    this.render({ items, config, sortAttr: sort, shouldReverse: this.sortAttr === sort ? !this.shouldReverse : this.shouldReverse})
  }

  return html`
    <table>
      <thead>
        <tr>${headers(setSort.bind(this), this.sortAttr, this.shouldReverse, config)}</tr>
      </thead>
      ${toListItems(config, sortAttr, items, this.shouldReverse ? reverse : identity)}
    </table>
  `
}

const updateFn = function (items, config, sortAttr, shouldReverse) {
  return sortAttr !== this.sortAttr || shouldReverse !== this.shouldReverse
}

export default function Table () {
  if (!(this instanceof Table)) return new Table()
  Nanocomponent.call(this)
}

Table.prototype = Object.create(Nanocomponent.prototype)
Table.prototype.createElement = renderFn
Table.prototype.update = updateFn

function log(x) {
  console.log(x)
  return x
}

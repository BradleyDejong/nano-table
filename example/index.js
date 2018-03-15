import Table from '../src'
import { stringView } from '../src'
import choo from 'choo'
import {contains, append} from 'ramda'

const html = require('choo/html')

const table = new Table()

const app = choo()

app.use(store)
app.route('/', sampleView)
app.mount('body')

function store (state, emitter) {
}

const rerender = () => app.emit('render')


const isSelected = item => selected.indexOf(item) >= 0

const toggle = item => {
  selected = contains(item, selected) ? selected.filter(x => x !== item)
      : append(item, selected)
  rerender()
}

const checkboxView = item =>
  html`
    <td>
      <input onchange=${() => toggle(item)}
             ${isSelected(item)?'checked': ''}
             type="checkbox" />
    </td>
  `

const config = {
  columns: [
    { displayName: ' ', view: checkboxView, sortValue: x => 0 },
    { displayName: 'Name', sortValue: x => x.Name.split(' ')[1] },
    { displayName: 'Language', view: stringView(x => x['Invented']) },
    { displayName: 'Date', sortValue: x => x.Date.getTime() }
  ]
}
const items = [
  { 'Name': 'Brendan Eich', 'Invented': 'JavaScript', Date: new Date('1995') },
  { 'Name': 'Philip Wadler', 'Invented': 'Haskell', Date: new Date('1990') },
  { 'Name': 'John McCarthy', 'Invented': 'LISP', Date: new Date('1958') },
  { 'Name': 'Dennis Ritchie', 'Invented': 'C', Date: new Date('1972') },
  { 'Name': 'Don Syme', 'Invented': 'F#', Date: new Date('2005') }
]


const tableRender = () => {
  const args = table._arguments[0] || {items, config, sortAttr: 'Name', shouldReverse: false}
  return table.render.call(table, args)
}

function sampleView (state, emit) {
  return html`
    <body>
      ${tableRender()}

      ${selected.map(x => x.Name).join(', ')}
    </body>
  `
}

let selected = [items[2]]

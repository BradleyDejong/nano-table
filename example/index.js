import Table from '../src'
import choo from 'choo'
import log from 'choo-log'

const html = require('choo/html')

const table = new Table()

const app = choo()

app.use(log)
app.use(store)
app.route('/', sampleView)
app.mount('body')

function store (state, emitter) {
}

const config = {
  columns: [
    {displayName: 'Value 1'},
    {displayName: 'Value 2'}
  ]
}
const items = [
  { 'Value 1': 4, 'Value 2': 'a' },
  { 'Value 1': 2, 'Value 2': 'z' },
  { 'Value 1': 3, 'Value 2': 'c' }
]

function sampleView (state, emit) {
  return html`
    <body>
      ${table.render(items, config, 'Value 1')}
    </body>
  `
}

import Table from '../src'
import choo from 'choo'

const html = require('choo/html')

const table = new Table()

const app = choo()

app.use(store)
app.route('/', sampleView)

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}

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

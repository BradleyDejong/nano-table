import Table from '../src'
import choo from 'choo'

const html = require('choo/html')

const table = new Table()

const app = choo()

app.use(store)
app.route('/', sampleView)
app.mount('body')

function store (state, emitter) {
}

const config = {
  columns: [
    {displayName: 'Name'},
    {displayName: 'Language', accessor: x => x['Invented']}
  ]
}
const items = [
  { 'Name': 'Brendan Eich', 'Invented': 'JavaScript' },
  { 'Name': 'Philip Wadler', 'Invented': 'Haskell' },
  { 'Name': 'John McCarthy', 'Invented': 'LISP' },
  { 'Name': 'Don Syme', 'Invented': 'F#' }
]

function sampleView (state, emit) {
  return html`
    <body>
      ${table.render(items, config, 'Name', false)}
    </body>
  `
}

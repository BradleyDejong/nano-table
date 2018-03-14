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
    {displayName: 'Language', accessor: x => x['Invented']},
    {displayName: 'silly', sortValue: x => x.silly[1] }
  ]
}
const items = [
  { 'Name': 'Brendan Eich', 'Invented': 'JavaScript', silly: '1z' },
  { 'Name': 'Philip Wadler', 'Invented': 'Haskell', silly: '2x' },
  { 'Name': 'John McCarthy', 'Invented': 'LISP', silly: '3w' },
  { 'Name': 'Don Syme', 'Invented': 'F#', silly: '4y' }
]

function sampleView (state, emit) {
  return html`
    <body>
      ${table.render(items, config, 'Name', false)}
    </body>
  `
}

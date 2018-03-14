# nano-table

A [nanocomponent](https://github.com/choojs/nanocomponent) for tables. Mainly for my own learning/experimentation.

## TODOS
- API design
  - Column configurations
    - ✓ display name
    - ✓ toString as default
    - ✓ allow override
    - ✓ sort fn
    - ✓ Default value fn for items where accessor returns null
    - ✓ Override sortBy on a column-by-column level
  - `tr` ID configuration
  - Callbacks on row click
  - ✓ Initial sort
  - (current sort callback)?
  - Allow for `table` or `ol`?

- User feedback
  - icon for which column is currently sorting
  - built-in styles(?)

- User interaction
  - ✓ Clicking header sorts by that item
  - ✓ Clicking header of already-selected sort reverses the sort

- Internals
  - ✓ Sort by asc/desc

- Integrations
  - Write documentation for nanocomponent adapters for use in Angular

- General
  - Write up API docs and examples
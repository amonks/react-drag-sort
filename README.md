# react-drag-sort

*This fork of [react-drag-sort](https://github.com/amonks/react-drag-sort) adds support to react 16. It updates reference of* **PropTypes** *from 'react' to 'prop-types' module, as per the changes to [prop-types support](https://reactjs.org/docs/typechecking-with-proptypes.html)*

generic component for draggable sort

based on react-dnd

[try it on codepen](http://codepen.io/amonks/pen/EZROVM?editors=1010)

```javascript
import React from 'react'
import {render} from 'react-dom'

import Sortable from '../../src'

class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collection: [
        {key: 1, value: 'a'},
        {key: 2, value: 'b'},
        {key: 3, value: 'c'},
        {key: 4, value: 'd'},
        {key: 5, value: 'e'},
        {key: 6, value: 'e'}
      ]
    }
  }

  Item ({value, index, onChange, onRemove, decorateHandle}) {
    return (
      <div>
        <span onClick={onRemove}>X</span>
        {decorateHandle(<span>+</span>)}
        <input
          onChange={e => {
            const val = e.target.value
            onChange(val)
          }}
          value={value}
        />
      </div>
    )
  }

  render () {
    return (
      <Sortable
        collection={this.state.collection}
        onChange={collection => {
          this.setState({collection})
        }}
        Component={this.Item}
      />
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
```


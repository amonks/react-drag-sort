import React from 'react'
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator'
import R from 'ramda'
import { DropTarget, DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import move from './util/move'

import itemType from './itemType'
import connectDropTarget from './connectDropTarget'

import SortableItem from './SortableItem'

/* SETUP
 */

const itemTarget = {
  drop: () => {
  }
}

@DragDropContext(HTML5Backend)
@DropTarget(itemType, itemTarget, connectDropTarget)
class SortableContainer extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    Component: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      collection: this.props.collection
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !(
      R.equals(nextProps, this.props)
    )
  }

  componentWillReceiveProps (newProps) {
    const oldCollection = this.props.collection
    const newCollection = newProps.collection

    if (R.equals(newCollection, oldCollection)) return

    this.setState({
      collection: newCollection
    })
  }

  @autobind
  findItem (id) {
    const collection = this.state.collection
    const item = collection.filter(i => R.equals(i.key, id))[0]

    return {
      item,
      index: collection.indexOf(item)
    }
  }

  @autobind
  onStateChange () {
    this.props.onChange(
      this.state.collection
    )
  }

  @autobind
  moveItem (id, toIndex) {
    const { index: fromIndex } = this.findItem(id)
    const updateState = R.evolve({
      collection: move(fromIndex, toIndex)
    })
    this.setState(updateState(this.state))
    this.onStateChange()
  }

  @autobind
  renderItem (item, index) {
    const { onChange, Component, collection } = this.props
    const key = item.key
    return (
      <SortableItem
        key={key}
        id={key}
        index={index}
        onRemove={() => {
          const index = R.findIndex(i => i.key === key, collection)
          const newCollection = R.remove(index, 1, collection)
          onChange(newCollection)
        }}
        onChange={value => {
          const index = R.findIndex(i => i.key === key, collection)
          const newCollection = R.adjust(R.assoc('value', value), index, collection)
          onChange(newCollection)
        }}
        findItem={this.findItem}
        moveItem={this.moveItem}
        value={item.value}
        Component={Component}
      />
    )
  }

  render () {
    const collection = this.state.collection

    if (!collection || R.isEmpty(collection)) return null

    return (
      <div>
        {collection.map(this.renderItem)}
      </div>
    )
  }
}

export default SortableContainer


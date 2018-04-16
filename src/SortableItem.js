import React from 'react'
import PropTypes from 'prop-types';
import R from 'ramda'
import autobind from 'autobind-decorator'
import { DragSource, DropTarget } from 'react-dnd'

import itemType from './itemType'
import connectDropTarget from './connectDropTarget'

/* SETUP
 */

const itemSource = {
  beginDrag: props => ({
    id: props.id,
    originalIndex: props.findItem(props.id).index
  }),

  endDrag: ({moveItem}, monitor) => {
    const { id: droppedId, originalIndex } = (monitor ? monitor.getItem() : {})
    const { didDrop } = monitor || {}

    // normally don't do anything
    if (didDrop) return

    // if they didn't drop in the drop zone,
    // move back to the original index
    moveItem(droppedId, originalIndex)
  }
}

const itemTarget = {
  canDrop: R.always(false),

  hover: ({id: overId, moveItem, findItem}, monitor) => {
    const {id: draggedId} = monitor.getItem()

    // don't do anything unless they moved the jawn
    if (draggedId === overId) return

    // if they did move the jawn, call move
    const { index: toIndex } = findItem(overId)
    moveItem(draggedId, toIndex)
  }
}

const decorateSortableItem = R.compose(
  DropTarget(
    itemType,
    itemTarget,
    connectDropTarget
  ),
  DragSource(
    itemType,
    itemSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
      connectDragPreview: connect.dragPreview()
    })
  )
)

/* COMPONENT
 */

@decorateSortableItem
class SortableItem extends React.Component {
  static propTypes = {
    Component: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any
  }

  @autobind
  decorateSortableItemElement (element) {
    const { connectDropTarget, connectDragPreview } = this.props
    return R.compose(connectDropTarget, connectDragPreview)(element)
  }

  render () {
    const { Component, isDragging, value, onChange, onRemove, index, connectDragSource } = this.props
    const opacity = isDragging ? 0 : 1

    console.log('render SortableItem')

    return this.decorateSortableItemElement(
      <div style={{opacity}}>
        <Component value={value} onRemove={onRemove} onChange={onChange} index={index} decorateHandle={connectDragSource} />
      </div>
    )
  }
}

SortableItem.displayName = 'SortableItem'

SortableItem.propTypes = {
  Component: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func,
  connectDragSource: PropTypes.func,
  findItem: PropTypes.func.isRequired,
  id: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  isDragging: PropTypes.bool,
  moveItem: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired
}
export default SortableItem


// import React, { useEffect, useState } from 'react';
import React, { Component } from "react";
import { DragSource } from "react-dnd";
import "./index.less";

const sourceObj = {
  beginDrag(props, monitor, component) {
    props.onDragItem(props.proInfo);
    return {
      proInfo: props.proInfo,
      instInfo: props.instInfo,
    };
  },
  endDrag(props, monitor) {
    props.onDragItem(undefined);
    // console.log(props)
    // const { onEndDrag } = props;
    // if (!onEndDrag) {
    //   return;
    // }
    // const dropResult = monitor.getDropResult();
    // if (!dropResult) {
    //   return;
    // }
    // if (props.id === dropResult.id) {
    //   return;
    // }
    // onEndDrag({ id: props.id, targetId: dropResult.id });
  },
};

@DragSource("BOX", sourceObj, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
class DragItem extends Component {
  render() {
    const { proInfo, connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div
        key={proInfo.processId}
        className={`side-list-row${isDragging ? " row-isDrag" : ""}`}
      >
        <span>{proInfo.processName}</span>
        <span>{proInfo.processCode}</span>
      </div>
    );
  }
}

export default DragItem;

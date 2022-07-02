import React, { Component } from "react";
import PropTypes from "prop-types";
import WorkOrder from "./work-order";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import isMobile from "./work-order/is-mobile";

import "./app.less";

export default class App extends Component {
  static propTypes = {
    height: PropTypes.number,
  };
  render() {
    const backend = isMobile ? TouchBackend : HTML5Backend;

    // backend = width > 1200 ? HTML5Backend : TouchBackend;
    // alert(width);
    // alert(navigator.userAgent.toLowerCase());
    // console.log(width > 1200, "backend");
    const DragHtmlHTML5 = window?.DragHtml?.HTML5;
    return DragHtmlHTML5 && !isMobile ? (
      <DragHtmlHTML5>
        <WorkOrder height={this.props.height || 500}></WorkOrder>
      </DragHtmlHTML5>
    ) : (
      <DragDropContextProvider backend={backend}>
        <WorkOrder height={this.props.height || 500}></WorkOrder>
      </DragDropContextProvider>
    );
  }
}

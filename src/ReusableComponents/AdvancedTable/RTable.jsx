import React, { Component } from 'react';
import { isEqual } from 'lodash';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css'
import './rTable.css'

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class RTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  componentDidMount() {

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)) {
      return true;
    } else {
      return false
    }
  }

  render() {
    return (
      <>
        <div className="numberOfRows hidden-pc"><b>{this.props.data.length}</b> rows</div>
        <ReactTableFixedColumns
          className="-striped mobile-overflow"
          data={this.props.data}
          columns={this.props.columns}
          style={this.props.style ? this.props.style : {}}
          minRows={this.props.minRows === undefined ? 3 : this.props.minRows}
          previousText={<i className="fa fa-chevron-left"></i>}
          nextText={<i className="fa fa-chevron-right"></i>}
          SubComponent={this.props.SubComponent ? this.props.SubComponent : null}
          showPagination={this.props.showPagination ? this.props.showPagination : false}
          showPaginationBottom={this.props.defaultPageSize ? true : (this.props.showPaginationBottom ? this.props.showPaginationBottom : false)}
          showPaginationTop={this.props.showPaginationTop ? this.props.showPaginationTop : false}
          defaultPageSize={this.props.defaultPageSize ? this.props.defaultPageSize : 99999999}
          resizable={this.props.resizable ? this.props.resizable : false}
          defaultSorted={this.props.defaultSorted ? this.props.defaultSorted : []}
        />
        {this.props.showRowSelectedAndRowCount === true &&
          <div className="numberOfRows hidden-mobile"><b>{this.props.data.length + (this.props.pageSize * (this.props.currentPage - 1))}/{this.props.recordCount} </b> row(s)</div>
        }
      </>
    )
  }
}
export default RTable;
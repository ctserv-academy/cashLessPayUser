import React from 'react';
import { NavLink } from 'reactstrap';

import Avatar from '../../UIElements/Avatar';
import Card from '../../UIElements/Card';
import Preview from './Preview';

import './FileItem.css';

class FileItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showPreview: false
    }

  }

  togglePreview = (e) => {
    e.preventDefault();
    if (this.props.fileType === "msg") {
      const fileLink = document.createElement('a');
      fileLink.href = this.props.url;
      fileLink.download = this.props.name;
      fileLink.click();
      window.URL.revokeObjectURL(this.props.url);
      return;
    }
    this.setState((prev) => ({
      showPreview: !prev.showPreview
    }))
  }

  render() {

    const { name, source, url, fileType, thumbnail, onDeleteClick, classRow, readOnly } = this.props;

    return (
      <li className={`file-item ${classRow}`} style={classRow ? { marginRight: "initial", marginLeft: "initial" } : {}}>
        <Card className="file-item__content">
          {!readOnly &&
            <div className="file-item__remove pointer" onClick={onDeleteClick(name, source)}><i className="fa fa-remove" /></div>
          }
          <NavLink onClick={this.togglePreview}>
            <div className="file-item__image">
              <Avatar image={thumbnail} alt={name} />
            </div>
            <div className="file-item__info">
              <h2>{name}</h2>
            </div>
          </NavLink>
        </Card>
        {this.state.showPreview &&
          <Preview file={url} fileType={fileType} title={name} togglePreview={this.togglePreview} />
        }
      </li>
    )

  }

}

export default FileItem;

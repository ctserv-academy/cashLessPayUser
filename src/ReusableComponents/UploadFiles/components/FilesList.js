import React from 'react';

import FileItem from './FileItem';

import './FilesList.css';

const FilesList = props => {

  const { items, onDeleteClick, classRow, readOnly } = props;

  const files = items.filter(item => {
    return item.deleted === false
  })

  if (files.length === 0) {
    return (
      <div className={`files-list ${props.className}`}>
        <div className="center" style={props.isEmail ? { height: "50px" } : { height: "70px" }}>
          <h5>No attachment found.</h5>
        </div>
      </div>
    );
  }

  return (
    <ul className={`files-list ${classRow ? "row" : ""}`} style={classRow ? { justifyContent: "flex-start" } : {}}>
      {files.map(file => (
        <FileItem
          key={file.name}
          url={file.url}
          thumbnail={file.thumbnail}
          name={file.name}
          source={file.source}
          fileType={file.fileType}
          onDeleteClick={onDeleteClick}
          classRow={classRow}
          readOnly={!readOnly ? file.readOnly ? file.readOnly : false : readOnly}
        />
      ))}
    </ul>
  );

};

export default FilesList;

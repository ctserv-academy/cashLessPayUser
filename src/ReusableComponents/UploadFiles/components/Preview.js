import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import FileViewer from 'react-file-viewer';

import './Preview.css';

const Preview = props => {

  const { title, file, fileType, togglePreview } = props;

  const Iframe = <iframe
    id={`upload${title}`}
    title={title}
    src={file}
    width="100%"
    height={`${window.innerHeight - 33}px`}
    frameBorder="0"
  />;

  const fileViewerHandleError = useCallback((e) => {
    return Iframe
  }, [Iframe]);

  const generateContentBody = useCallback(() => {
    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "PNG":
      case "png":
      case "gif":
      case "bmp":
      case "docx":
      case "xlsx":
      case "mp4":
      case "webm":
      case "mp3":
      case "pdf":
        return (
          <FileViewer
            fileType={fileType.toLowerCase()}
            filePath={file}
            onError={fileViewerHandleError}
          />
        )
      case "xls":
      case "msg":
        const fileLink = document.createElement('a');
        fileLink.href = file;
        fileLink.download = title;
        fileLink.click();
        window.URL.revokeObjectURL(file);
        return <div className="center-div" style={{ color: "#fff", fontSize: "50px" }}><i className="fa fa-download"></i></div>
      default:
        return Iframe
    }
  }, [fileViewerHandleError, fileType, file, title, Iframe]);

  const content = (
    <React.Fragment>
      <div id="modal-overlay-content">
        <div className="row" style={{ backgroundColor: "#20a8d8", color: "#fff" }}>
          <div className="col-11" style={{ margin: "auto 0", paddingLeft: "30px" }}>
            {title}
          </div>
          <div className="col-1">
            <Button onClick={togglePreview} style={{ backgroundColor: "#20a8d8", color: "#fff", float: "right", border: "none" }}>
              <span><i className="fa fa-close" aria-hidden="true"></i></span>
            </Button>
          </div>
        </div>
        <div className="row" style={{ height: "100%" }}>
          <div className="col-12" style={{ backgroundColor: "#525252", textAlign: "center" }}>
            {generateContentBody()}
          </div>
        </div>
      </div>
    </React.Fragment>
  )

  if (document.getElementById('modal-overlay')) {
    return ReactDOM.createPortal(content, document.getElementById('modal-overlay'));
  } else {
    return content;
  }


}

export default Preview

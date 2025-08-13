import React from 'react'
import { ProgressBar, Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { printPlugin } from '@react-pdf-viewer/print';
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import '@react-pdf-viewer/print/lib/styles/index.css';
import { isOnMobile, isOnPC } from '../../utils/functions';
import "./PdfViewer.css"
import useScreenSize from '../../CustomHooks/useScreenSize';

const PrintPDFButton = (props) => {
    return <div aria-describedby="rpv-core__tooltip-body-print">
        <button aria-label="Print"  // Native tooltip text
            onClick={props.Print} aria-keyshortcuts="Ctrl+P" className="rpv-core__minimal-button" type="button" >
            <svg aria-hidden="true" className="rpv-core__icon" focusable="false" height="16px" viewBox="0 0 24 24" width="16px">
                <path d="M7.5,19.499h9 M7.5,16.499h9 M5.5,16.5h-3c-1.103-0.003-1.997-0.897-2-2v-6c0.003-1.103,0.897-1.997,2-2h19c1.103,0.003,1.997,0.897,2,2v6c-0.003,1.103-0.897,1.997-2,2h-3M5.5,4.5v-4h9.586c0.265,0,0.52,0.105,0.707,0.293l2.414,2.414C18.395,3.394,18.5,3.649,18.5,3.914V4.5 M18.5,22.5c0,0.552-0.448,1-1,1h-11c-0.552,0-1-0.448-1-1v-9h13V22.5zM3.5,8.499c0.552,0,1,0.448,1,1s-0.448,1-1,1s-1-0.48-1-1S2.948,8.499,3.5,8.499zM14.5,0.499v4h4">
                </path>
            </svg>
        </button>
    </div>
}

const PDFNavigator = ({ goToPrevious, goToNext, pageIndex, numPages, disableNext, disablePrevious, hidePreviousButton, hideNextButton, ...props }) => {
    return <div style={
        { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-end', alignItems: 'center' }}>
        {!hidePreviousButton && <button onClick={goToPrevious} disabled={disablePrevious} >
            &lt;
        </button>}
        {!hideNextButton && <button onClick={goToNext} disabled={disableNext} >
            &gt;
        </button>}
    </div>
}
export default function PDFViewer({ url, closePdfViewer, goToNext, goToPrevious, disableNext, disablePrevious, prtResLock, hidePreviousButton, hideNextButton, height }) {
    const printPluginInstance = printPlugin();
    // const { PrintButton } = printPluginInstance;
    const fileUrls = url
    // const [selectedIndex, setSelectedIndex] = useState(0)

    // const [pageIndex, setPageIndex] = useState(0)


    const defaultLayoutPluginInstance = defaultLayoutPlugin(
        {
            sidebarTabs: (defaultTabs) => {
                if (isOnMobile()) {
                    return [];
                }
                return [
                    defaultTabs[0]
                ]
                // return defaultTabs
            },
            renderToolbar: (Toolbar) =>
                <Toolbar>
                    {(slots) => {
                        // Render only specific toolbar items
                        return (
                            <>
                                <div className='rpv-toolbar__left'>
                                    {slots.ShowSearchPopover()}
                                    {slots.GoToPreviousPage()}
                                    {slots.CurrentPageInput()}
                                    <div> of   {slots.NumberOfPages()} </div>


                                    {slots.GoToNextPage()}
                                </div>

                                <div className='rpv-toolbar__center'>
                                    {slots.ZoomOut()}
                                    {isOnPC() && slots.Zoom()}
                                    {slots.ZoomIn()}

                                    <PDFNavigator
                                        pageIndex={0}
                                        // numPages={fileUrls.current.length}
                                        goToNext={goToNext}
                                        goToPrevious={goToPrevious}
                                        disableNext={disableNext}
                                        disablePrevious={disablePrevious}
                                        hidePreviousButton={hidePreviousButton}
                                        hideNextButton={hideNextButton}
                                    />

                                </div>

                                <div className='rpv-toolbar__right' style={{ minWidth: '15%', justifyContent: 'flex-end' }}>
                                    {/* {slots.Print()} */}
                                    {prtResLock && <PrintPDFButton Print={(ev) => {
                                        printPluginInstance.print()
                                    }} />
                                    }
                                    <div className='closeIcon' onClick={closePdfViewer}>
                                        <i className="fa fa-times" aria-hidden="true" ></i>
                                    </div>
                                </div>

                            </>

                            // {slots.currentPageInput}
                            // {slots.nextPageButton}
                            // {slots.zoomOutButton}
                            // {slots.zoomPopover}
                            // {slots.zoomInButton}
                            // {slots.fullScreenButton}
                            // {slots.openFileButton}


                        );
                    }}
                </Toolbar>


        }
    );

    const { screenWidth } = useScreenSize()
    return (
        <div>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
                <div
                    style={{
                        height: height ? height : 'calc(100vh - 170px)',
                        // maxWidth: "900px",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                >
                    <Viewer
                        fileUrl={fileUrls}
                        renderLoader={(percentages) => (
                            <div style={{ width: '240px' }}>
                                <ProgressBar progress={Math.round(percentages)} />
                            </div>)}
                        plugins={[defaultLayoutPluginInstance, printPluginInstance]}
                        // defaultScale={isOnMobile() ? SpecialZoomLevel.PageWidth : 2}
                        defaultScale={screenWidth < 1356 ? SpecialZoomLevel.PageWidth : 2}
                        closeOnClickOutside
                    />
                </div>
            </Worker>

            {/* <div className='page' >
                <header>

                    <div className='row avoidBreak' style={{ height: "220px", border: "5px solid red" }}>
                        <div className="col-6">
                            header
                        </div>
                    </div>

                </header>
                <div className='row avoidBreak' style={{ height: "920px", border: "5px solid green" }}>
                    <div className="col-6">
                        hi
                    </div>
                    <div className="col-6">
                        <div>Patient Visit Report</div>

                    </div>
                </div>

                <div className='row avoidBreak' style={{ height: "720px", border: "5px solid red" }}>
                    <div className="col-6">
                        hi
                    </div>
                    <div className="col-6">
                        <div>Patient Visit Report</div>

                    </div>
                </div>

                <div className='row avoidBreak' style={{ height: "1620px", border: "5px solid red" }}>
                    <div className="col-6">
                        hi
                    </div>
                    <div className="col-6">
                        <div>Patient Visit Report</div>

                    </div>
                </div>


            </div> */}
        </div>
    )
}

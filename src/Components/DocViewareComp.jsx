import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import DocuViewareApi from "./DocViewareConf";
import { Button, ButtonGroup } from "reactstrap";
import { archivingUrlPath } from "../globals";

export default function DocViewareComp({ docPath, toggle }, ...props) {
    // const endPoint = useRef('https://localhost:44319/Swagger/api/DocuViewareREST/GetDocuViewareControl');
    const endPoint = useRef(`${archivingUrlPath}/API/api/DocuViewareREST/GetDocuViewareControl`);

    const [doc, setDoc] = useState(null);
    const [saveEnabled, setSaveEnabled] = useState(false);
    const insertMarkup = (markup, id) => {
        const target = document.getElementById(id);
        if (target.hasChildNodes()) {
            // If target already has children, choose what to do
            target.removeChild(target.firstChild)
        }
        const fragment = document
            .createRange()
            .createContextualFragment(markup["HtmlContent"]);
        document.getElementById(id).appendChild(fragment);
        document.getElementById('saveButtonDocuVieware1') ? document.getElementById('saveButtonDocuVieware1').style.display = JSON.parse(localStorage.getItem('archReportPrintPrv')) ? "inline-block" : "none" : console.log('test')
    };
    const awaitableTimeOut = (n) => new Promise((rs, rj) => {
        setTimeout(() => rs(1), n)
    })
    const getDocuViewareMarkup = useCallback(async () => {
        try {
            setDoc(null)
            let obj = {
                ...DocuViewareApi.config,
                AllowPrint: JSON.parse(localStorage.getItem('archReportPrintPrv')),
                EnablePrintButton: JSON.parse(localStorage.getItem('archReportPrintPrv')),

            }
            let cfg = { ...obj, documentPath: docPath.replace('png', 'tif'), isUploadInterface: docPath ? false : true }

            const markup = fetch(
                endPoint.current,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cfg)
                }
            );
            // await awaitableTimeOut(5000)
            return (await markup).json();
        }
        catch (err) {
            return err;
        }
    }, [docPath]);

    useLayoutEffect(() => {
        // if (docPath)
        getDocuViewareMarkup().then(document => {
            setDoc(document)
            insertMarkup(document, 'dvContainer')
        })

    }, [docPath])

    const registerDocumentLoaded = function () {
        if (typeof window.DocuViewareAPI !== "undefined" && window.DocuViewareAPI.IsInitialized("DocuVieware1")) {
            window.DocuViewareAPI.RegisterOnNewDocumentLoaded("DocuVieware1", function () {
                setSaveEnabled(true)
            });
        }
        else {
            setTimeout(() => {
                registerDocumentLoaded()
            }, 3000);
        }
    }

    useEffect(() => {
        registerDocumentLoaded()

        return () => {
            window.DocuViewareAPI.RegisterOnNewDocumentLoaded("DocuVieware1", null)
        }
    }, [])


    const uploadScannedImage = useCallback((e) => {
        window.DocuViewareAPI.PostCustomServerAction(
            "DocuVieware1",
            true,
            "uploadImage",
            "", () => {
                toggle()
            }
        );

    }, [])


    return (
        <>
            {doc === '' ? <div>Loading...</div> : <div />}
            <div id="dvContainer" style={{ height: docPath ? "100%" : "95%", width: "100%" }} />
            {!docPath &&
                <div className="row">
                    <div className="col-12 text-end">
                        <ButtonGroup>
                            <Button
                                color="primary"

                                onClick={() => {
                                    // window.DocuViewareAPI.CloseDocument('DocuVieware1')

                                    uploadScannedImage();
                                }}
                                disabled={!saveEnabled}
                            >
                                Save
                            </Button>

                        </ButtonGroup>
                    </div>

                </div>}
        </>



    )
}

export default class DocuViewareApi {
    static config = {
        DocumentID: "",
        SessionId: "mySessionId",//Set to an arbitrary value, should be replaced by the 
        //session identifier from your session mechanism
        ControlId: "DocuVieware1",
        AllowPrint: JSON.parse(localStorage.getItem('archReportPrintPrv')),
        EnablePrintButton: JSON.parse(localStorage.getItem('archReportPrintPrv')),
        AllowUpload: true,
        EnableFileUploadButton: true,
        CollapsedSnapIn: true,
        ShowAnnotationsSnapIn: true,
        EnableRotateButtons: true,
        EnableZoomButtons: true,
        EnablePageViewButtons: true,
        EnableMultipleThumbnailSelection: true,
        EnableMouseModeButtons: true,
        EnableFormFieldsEdition: true,
        EnableTwainAcquisitionButton: true,
        Locale: "en"
    };
}
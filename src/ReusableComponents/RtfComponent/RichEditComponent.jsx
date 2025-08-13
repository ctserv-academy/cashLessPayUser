import 'devextreme/dist/css/dx.light.css';
import 'devexpress-richedit/dist/dx.richedit.css';
import React from 'react';
import {
    create, createOptions, RichEdit, ViewType, RichEditUnit,
    DocumentFormat, RibbonTabType
} from 'devexpress-richedit';
import './richEditComponent.css'


class RichEditComponent extends React.Component {

    constructor(props) {
        super(props)
        this.rich = RichEdit;
        this.created = false
        this.DocFormat = DocumentFormat
        this.options = createOptions();

    }
    awaitableExportToRTF = () => new Promise((rs, rj) => {
        this.rich.hasUnsavedChanges = false
        this.rich.exportToBase64((b64str) => {
            rs(b64str)
        }, DocumentFormat.Rtf)


    })

    clearDocument = () => {

        this.rich.document.deleteText(this.rich.document.interval)
        this.rich.hasUnsavedChanges = false
    }

    hasContent = () => {
        if (this.rich.hasUnsavedChanges === true) {
            return true
        }
        return false
    };

    componentDidMount() {



        let FilesTab = this.options.ribbon.getTab(RibbonTabType.File);
        this.options.ribbon.removeTab(FilesTab)
        let ViewTab = this.options.ribbon.getTab(RibbonTabType.View);
        this.options.ribbon.removeTab(ViewTab);
        let PageLayoutTab = this.options.ribbon.getTab(RibbonTabType.PageLayout);
        this.options.ribbon.removeTab(PageLayoutTab);
        let ReferencesTab = this.options.ribbon.getTab(RibbonTabType.References);
        this.options.ribbon.removeTab(ReferencesTab);
        let MailTab = this.options.ribbon.getTab(RibbonTabType.MailMerge);
        this.options.ribbon.removeTab(MailTab);

        if (this.props.hideRibbon) {
            //remove the ribbon
            this.options.ribbon.visible = false;
        }

        this.options.bookmarks.visibility = true;
        this.options.bookmarks.color = '#ff0000';

        this.options.confirmOnLosingChanges.enabled = true;
        this.options.confirmOnLosingChanges.message = 'Are you sure you want to perform the action? All unsaved document data will be lost.';

        this.options.fields.updateFieldsBeforePrint = true;
        this.options.fields.updateFieldsOnPaste = true;

        this.options.mailMerge.activeRecord = 2;
        this.options.mailMerge.viewMergedData = true;
        this.options.mailMerge.dataSource = [
            { Name: 'Indy', age: 32 },
            { Name: 'Andy', age: 28 },
        ];

        // events
        this.options.events.activeSubDocumentChanged = () => { };
        this.options.events.autoCorrect = () => { };
        this.options.events.calculateDocumentVariable = () => { };
        this.options.events.characterPropertiesChanged = () => { };
        this.options.events.contentInserted = () => { };
        this.options.events.contentRemoved = () => { };
        this.options.events.documentChanged = () => { };
        this.options.events.documentFormatted = () => { };
        this.options.events.documentLoaded = () => { };
        this.options.events.gotFocus = () => { };
        this.options.events.hyperlinkClick = () => { };
        this.options.events.keyDown = () => { };
        this.options.events.keyUp = () => { };
        this.options.events.paragraphPropertiesChanged = () => { };
        this.options.events.lostFocus = () => { };
        this.options.events.pointerDown = () => { };
        this.options.events.pointerUp = () => { };

        this.options.events.saving = (s, e) => { }

        this.options.events.selectionChanged = () => { };
        this.options.events.customCommandExecuted = (s, e) => {
            switch (e.commandName) {
                case 'insertEmailSignature':
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, '_________');
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, 'Best regards,');
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, 'John Smith');
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, 'john@example.com');
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, '+1 (818) 844-0000');
                    break;
                default:
                    break;
            }
        };

        this.options.unit = RichEditUnit.Inch;

        this.options.view.viewType = ViewType.PrintLayout;
        this.options.view.simpleViewSettings.paddings = {
            left: 15,
            top: 15,
            right: 15,
            bottom: 15,
        };
        // this.options.exportUrl = 'https://siteurl.com/api/';s

        this.options.readOnly = this.props.readOnly ? this.props.readOnly : false
        this.options.width = '100%';
        this.options.height = this.props.height ? this.props.height : '400px';
        this.options.authentication = "1234"

        //hide horizontal ruler
        this.options.view.printLayoutViewSettings.showHorizontalRuler = false;

        if (!this.created) {
            this.rich = create(document.getElementById(this.props.id), this.options);
            this.created = true
        }
        this.rich.readOnly = this.props.readOnly ? this.props.readOnly : false
    }

    render() {
        return (
            <>
                <div id={this.props.id}></div>
            </>

        );
    }
}

export default RichEditComponent 
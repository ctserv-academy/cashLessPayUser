import axios from "axios";
import Moment from 'moment';
import {
    cloneDeep,
    isEmpty,
    map
} from "lodash";
import { mobileDevicesWidth, timeOutOnSave } from "../globals";
export const ColoringStatusLikeLegends = (status) => {

    let color = "";
    status = status ? status : ""
    if (status.toLowerCase() === "pending" || status.toLowerCase() === "on-hold" || status.toLowerCase() === "waiting approval") {
        color = "#ffa500"
    } else if (status.toLowerCase() === "approved" || status.toLowerCase() === "active" || status.toLowerCase() === "started" || status.toLowerCase() === 'a') {
        color = "#00cc00"
    } else if (status.toLowerCase() === "rejected" || status.toLowerCase() === "inactive" || status.toLowerCase() === "i") {
        color = "#ff0000"
    } else if (status.toLowerCase() === "draft") {
        color = "#999999"
    } else if (status.toLowerCase() === "waiting my approval") {
        color = "#33ccff";
    }

    if (status) {
        return <span><span style={{ color }}><i className="fa fa-circle"></i></span> {status}</span>;
    } else {
        return "";
    }

}

export const isOnMobile = () => window.innerWidth < mobileDevicesWidth;
export const isOnPC = () => !isOnMobile();

export const CalculateTitleHeight = (id) => {
    return document.getElementById(id) ? document.getElementById(id).offsetHeight : 0
}
export const handleEmpty = () => {
    throw new Error('Invalid Type, must be get or post ')
}

export async function FetchData(url, Type = handleEmpty(), params = null, datafilterfunction = () => true, controller, apiReport) {
    try {
        if (Type === 'get') {
            let queryparams = new URLSearchParams({ ...params });
            let resp = await axios({ method: 'get', url: url + `${!isEmpty(params) ? `?${queryparams.toString()}` : ''}`, crossDomain: true, signal: controller ? controller.signal : null });
            await awaitableTimeOut(500);
            return {
                ...cloneDeep(resp), data: resp.data.filter(datafilterfunction)
            }
        }
        else {
            let resp = await axios({
                method: 'post',
                signal: controller ? controller.signal : null,
                url: url,
                data: isEmpty(params) ? JSON.stringify({}) : JSON.stringify(params),
                "responseType": apiReport ?  "blob" : "json" ,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });

            await awaitableTimeOut(500);

            return {
                ...cloneDeep(resp), data: resp.data.filter(datafilterfunction)
            }
            // await awaitableTimeOut(500);

            // let uri = new URL(url);
            // let MethodName = uri.href.substring(uri.href.lastIndexOf("/")).replace("/", '')
            // let r = resp.data[`${MethodName}Result`];
            // if (isEmpty(r)) {
            //     return []
            // }
            // else {
            //     return JSON.parse(r)
            // }


        }
    }
    catch (e) {
        throw e;
    }


}
export async function FetchDataMultiple(params) {
    try {
        params.forEach(element => {
            if (element.Type.toLowerCase() !== 'get' && element.Type.toLowerCase() !== 'post') {
                handleEmpty();
            }
        });

        let resp = await Promise.all(params.map(p => {
            return PromisfiedAxiosRequest(p.url, p.Type, p.params)
        }))


        resp = resp.map((v, i) => {
            if (params[i].datafilterfunction) {
                return v.filter(params[i].datafilterfunction)
            }
            else {
                return v;
            }
        })
        return resp;


    }
    catch (e) {
        throw e;
    }


}

export async function GetPrivileges(urlPath,moduleCode, StepCode) {
    let data = {
        moduleCode: moduleCode,
        StepCode: StepCode
    }
    let response = await FetchData(`${urlPath}/System/GetFormUserPriv`, 'get', data);
    return response;
}

export const awaitableTimeOut = (timeout) => new Promise((rs, rj) => {
    setTimeout(() => {
        rs(1)
    }, timeout);

})
export const readfileasync = (file) => new Promise((rs, rj) => {
    var reader = new FileReader()
    reader.onloadend = () => {
        rs(reader.result)
    }
    reader.readAsDataURL(file)
})

export const isRequiredDataEmpty = (state) => {
    let mandatory = "";
    if (state.mode === "Edit" || state.mode === 'Modify') {
        mandatory = state.mandatoryEdit
    } else {
        mandatory = state.mandatory;
    }
    let missing = {}
    if (!mandatory)
        return
    for (let key of mandatory) {
        const valueToBeChecked = state[key];

        if (typeof valueToBeChecked === "number") {
            if (valueToBeChecked === 0)
                missing[`missing${key}`] = true;
        } else if (typeof valueToBeChecked === "object") {
            if (JSON.stringify(valueToBeChecked) === "{}")
                missing[`missing${key}`] = true;
        } else if (isEmpty(valueToBeChecked)) {
            missing[`missing${key}`] = true
        }
    }

    return missing
}

export const isRequiredDataEmptyPatientAdmission = (state, setState) => {
    let RequiredFields = cloneDeep(state.data.IsMandatoryFields);
    let EmptyRequiredFields = cloneDeep(state.data.EmptyRequiredFields);

    for (let manField in RequiredFields) {
        map(RequiredFields[manField], FieldsMandatory => {

            if (state.data[manField][FieldsMandatory] === null) {
                EmptyRequiredFields[manField].push(FieldsMandatory);
            } else if (typeof state.data[manField][FieldsMandatory] === 'object') {
                if (JSON.stringify(state.data[manField][FieldsMandatory]) === '{}') {
                    // to developp what to do 
                }
            } else if (typeof state.data[manField][FieldsMandatory] === 'number') {
                if (state.data[manField][FieldsMandatory] === 0) {
                    EmptyRequiredFields[manField].push(FieldsMandatory);
                }
            } else {
                if (isEmpty(state.data[manField][FieldsMandatory])) {
                    EmptyRequiredFields[manField].push(FieldsMandatory);
                }
            }
        })
    }
    let o = {
        ...state.data,
        EmptyRequiredFields: EmptyRequiredFields
    }
    setState({ ...state, data: o })
}

export const saveFinished = (state, setState, notifType, notifTitle, notifMessage, goBack, navigate) => {

    setState({ ...state, notifType, notifTitle, notifMessage, notifDisplay: 'block' },
        async (nextState, setNextState) => {
            await awaitableTimeOut(timeOutOnSave);
            if (nextState.notifType !== 'error') {
                setNextState({ ...nextState, notifDisplay: 'none' },
                    (afternextState, setAfterNextState) => {
                        if (!goBack) {

                        }
                        else {
                            navigate(-1)
                        }
                    })
            }

        })
}

export const customTableSearch = (filterText, data, FilterOptions = null) => {
    let searchedValue = filterText.toLowerCase();
    let regExDateFormat = /^[0-9]{2}(\/|-)[0-9]{2}(\/|-)[0-9]{4}/; // start with DD/MM/YYYY or DD-MM-YYYY or MM/DD/YYYY or MM-DD-YYYY
    let regExDateFormat2 = /^[0-9]{4}(\/|-)[0-9]{2}(\/|-)[0-9]{2}/; // start with YYYY/DD/MM or YYYY-DD-MM or YYYY/MM/DD or YYYY-MM-DD
    let dataFiltered = [];



    let includedColumns = !isEmpty(FilterOptions) ?
        FilterOptions.filter(e => e.isSelected).map(e => e.columnName) :
        data.length > 0 ? Object.keys(data[0]) : []


    if (searchedValue) {
        dataFiltered = data.filter(row => {
            let getRow = true;
            if (searchedValue) {

                getRow = false;

                for (let key of includedColumns) {
                    let value = row[key]

                    if (value && (regExDateFormat.test(value) || regExDateFormat2.test(value) || typeof value.getMonth === "function")) {
                        getRow = getRow || Moment(value).format("DD/MM/YYYY").includes(searchedValue.trim()) || Moment(value).format("DD-MM-YYYY").includes(searchedValue.trim()) || value.toString().toLowerCase().includes(searchedValue.trim());
                    } else if (value) {
                        getRow = getRow || value.toString().toLowerCase().includes(searchedValue.trim());
                    }
                }

            }

            return getRow

        })
    }
    else {
        dataFiltered = cloneDeep(data)
    }
    return dataFiltered



}
export const PromisfiedAxiosRequest = (url, Type = handleEmpty(), params = null, controller = null) => new Promise((rs, rj) => {
    if (Type === 'get') {
        let queryparams = new URLSearchParams({ ...params });
        axios({
            method: 'get',
            // url: url + `${!isEmpty(queryparams) ? `?${queryparams.toString()}` : ''}`,
            url: url + `${queryparams.toString() !== '' ? `?${queryparams.toString()}` : ''}`,
            signal: controller ? controller.signal : null,
            crossDomain: true,
            //params:params
        }).then(resp => setTimeout(() => {
            rs(resp)
        }, 500))
            .catch(err => rj(err))
    }
    else {
        axios({
            method: 'post',
            url: url,
            signal: controller ? controller.signal : null,
            data: isEmpty(params) ? JSON.stringify({}) : JSON.stringify(params),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(resp => rs(resp)).catch(err => rj(err))
    }

});


export const buildTypeFromBase64 = (base64string) => {


    if (!isEmpty(base64string)) {
        let fileType = ''
        // let nameExtension = ''
        switch (base64string.charAt(0)) {
            case '/':
                fileType = 'jpeg'
                break;
            case 'i':
                fileType = 'png'
                break;
            case 'R':
                fileType = 'gif'
                break;
            case 'U':
                if (base64string.charAt(1) === "E") {
                    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    // nameExtension = 'xlsx'
                } else {
                    fileType = 'webp'
                }
                break;
            case 'D':
                fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                // nameExtension = 'docx'
                break;
            default:
                break;

        }
        //image/jpeg;base64,
        if (base64string.slice(0, 2) !== "UE" && base64string.charAt(0) !== "D") {
            base64string = { data: `data:image/${fileType};base64,${base64string}` }
        } else {
            base64string = [{
                deleted: false,
                file: `data:${fileType};base64,${base64string}`,
                name: 'name.xls',
                readOnly: false,
            }]
        }
        return base64string;
    }
}

export const getBase64 = (itemObject) => {
    const { file, ...restProperties } = itemObject;
    return new Promise((resolve, reject) => {

        if (file instanceof File === false) {
            const newItemObject = { ...itemObject };
            newItemObject.file = newItemObject.file.split(',')[1];
            return resolve(newItemObject);
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const newObject = {
                ...restProperties,
                file: reader.result.split(',')[1]
            };
            resolve(newObject);
        }
        reader.onerror = error => reject(error);
    });
}

export const convertImageBase64ToURL = (base64) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });

    // Create an object URL for the blob
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
};

export const convertBase64ToFile = (base64, filename) => {
    // Remove the data URL scheme part (e.g., "data:image/png;base64,")
    const fileType = base64.split(':')[1].split(';')[0]
    const base64Data = base64.split(',')[1];

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    const file = new File([blob], filename, { type: fileType });

    return file;
};

export const returnCosignType = (state) => {
    if (state.subType === 'RN')
        return 'V'
    else if (state.subType === 'A')
        return 'N'
    else
        return 'C'
}

export const handleSexAndMaritalStatus = (sex, maritalStatus) => {
    let maidenFunctionValidationReturned // in the state is false by default
    let spouseFunctionValidationReturned // in the state is false by default

    if (maritalStatus === 'S' || maritalStatus === 'D') {
        maidenFunctionValidationReturned = true;
        spouseFunctionValidationReturned = true;
    } else if (maritalStatus !== 'S') {
        if (sex === 'M') {
            if (maritalStatus === 'W' || maritalStatus === 'P') {
                maidenFunctionValidationReturned = true;
                spouseFunctionValidationReturned = true;
            } else {
                maidenFunctionValidationReturned = true;
                spouseFunctionValidationReturned = false;
            }
        } else {
            if (maritalStatus === 'W' || maritalStatus === 'P') {
                maidenFunctionValidationReturned = false;
                spouseFunctionValidationReturned = true;
            } else {
                maidenFunctionValidationReturned = false;
                spouseFunctionValidationReturned = false;
            }
        }
    }
    return { maidenFunctionValidationReturned, spouseFunctionValidationReturned }


}

export function parseUrlParams(url) {

    // http://183.183.183.242:8081/Archiving?MRN=00036363&userCode=MH&sessionID=11111111111
    //http://localhost:3000/?MRN=00036363&userCode=MH&sessionID=11111111111
    // console.log(url)

    // const searchParams = new URLSearchParams(url.split('?')[1]);
    // const params = {};
    // console.log(Array.from(searchParams.entries()))

    // for (const [key, value] of searchParams.entries()) {
    //     params[key] = value;
    // }
    const result = {
        searchParams: [null, url], // searchParams[1] is the given object
    };

    console.log(result);
    return result

    // return params;

    // const myUrl = new URL(url);
    // const params = myUrl.pathname.split("/");
    // const MRN = params[1];
    // const userCode = params[2];
    // const sessionID = params[3];
    // return { MRN, userCode, sessionID };
}
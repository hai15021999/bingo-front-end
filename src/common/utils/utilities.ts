import { RcFile } from "antd/es/upload";

export module CommonUtility {

    export function isNullOrEmpty(data: any) {
        if (data === null || data === "" || data === undefined) {
            return true;
        }
        if (Array.isArray(data)) {
            return data.length === 0;
        }
        return false;
    }

    export function isNullOrUndefined(data: any) {
        if (data === null || data === undefined) {
            return true;
        }
        return false;
    }

    export function isEmptyObject(obj: any) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    export function isJsonString(str: any) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    export function ignoreSpaces(string: any) {
        let temp = "";
        string = '' + string;
        let splitstring = string.split(" ");
        for (let i = 0; i < splitstring.length; i++)
            temp += splitstring[i];
        return temp;
    }

    export function redirectTo(url: string): void {
        let elem = document.createElement('a');
        elem.href = url;
        elem.click();
    }

    export function getBase64(img: RcFile, callback: (url: string) => void) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    export function onTableSearch(searchValue: string, dataSource: any[], columns?: string[]) {
        if (isNullOrEmpty(columns)) {
            const dataSearch = dataSource.reduce((acc, cur) => {
                for (let property in cur) {
                    if ((cur[property].toString() as string)?.indexOf(searchValue) > -1) {
                        acc.push(cur);
                        break;
                    }
                }
                return acc;
            }, []);
            return dataSearch;
        } else {
            const dataSearch = dataSource.reduce((acc, cur) => {
                for (let column of columns as any[]) {
                    if ((cur[column]?.toString() as string)?.indexOf(searchValue) > -1) {
                        acc.push(cur);
                        break;
                    }
                }
                return acc;
            }, []);
            return dataSearch;
        }
    }
}
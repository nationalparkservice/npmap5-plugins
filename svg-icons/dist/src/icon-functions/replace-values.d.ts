import { IconFunctionParams, customFunctionType } from "../types";
export interface ReplaceValues extends IconFunctionParams {
    name: 'replaceValues';
    params: {
        [key: string]: string;
    };
}
declare const _default: customFunctionType;
export default _default;

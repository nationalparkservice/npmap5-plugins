export interface MessageData {
    'type': 'response' | 'error' | 'init' | 'exec' | 'get' | 'init_response';
    'id': string;
    'message': Array<any>;
    'error'?: Error;
    'command': string;
}
export declare const libraries: {
    [_: string]: any;
};
declare const subClasses: string[];
export declare type SubClasses = typeof subClasses[number];
export {};

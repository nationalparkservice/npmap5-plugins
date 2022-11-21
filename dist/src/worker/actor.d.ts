import { SubClasses } from './worker.js';
export declare function supportsWorkers(): boolean;
export declare function createActor(subClass: SubClasses, args?: Array<any>): Actor | WorkerlessActor;
declare class Actor {
    subClass: any;
    worker: Worker;
    handlers: Map<string, {
        'res': (value: any) => void;
        'rej': (value: Error) => void;
    }>;
    initId: string;
    _: {} | undefined;
    constructor(subClass: SubClasses, args?: Array<any>);
    onLoad(): Promise<unknown>;
    exec(command: string): (...args: any) => Promise<any>;
    get(command: string): Promise<any>;
}
/** Mimic the Actor so we can use the same interface when WebWorkers are not supported */
declare class WorkerlessActor {
    subClass: any;
    constructor(subClass: SubClasses, args?: Array<any>);
    onLoad(): Promise<any>;
    get(command: string): Promise<any>;
    exec(command: string): (...args: any) => Promise<any>;
}
export {};

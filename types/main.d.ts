/**
 * @see https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.headers.html
 */
export type HeadersInit = Headers | string[][] | Record<string, string>;
export class Headers implements Iterable<[string, string]> {
    constructor(init?: HeadersInit);
    append(name: string, value: string): void;
    forEach(callback: (value: string, name: string) => void): void;
    has(name: string): boolean;
    delete(name: string): void;
    get(name: string): string | null;
    set(name: string, value: string): void;

    // Iterable methods
    entries(): IterableIterator<[string, string]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    [Symbol.iterator](): Iterator<[string, string]>;
}

export type Method = "GET" | "POST" | "DELETE" | "PATCH" | "PUT" | "HEAD" | "OPTIONS";

export interface FetchOptions {
    url?: string;
    method?: Method | string;
    headers?: HeadersInit;
    body?: any;
    [rest: string]: any 
}

declare function fetchToCurl(
    requestInfo: string | FetchOptions,
    requestInit?: FetchOptions
): string;

export default fetchToCurl;

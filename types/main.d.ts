/**
 * @see https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.headers.html
 */
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
    values(): IterableIterator<[string]>;
    [Symbol.iterator](): Iterator<[string, string]>;
}

export interface FetchOptions {
    method?: "GET" | "POST" | "DELETE" | "PATCH" | "PUT" | "HEAD" | "OPTIONS";
    headers?: Headers | { [key: string]: string };
    body?: any;
    [rest: string]: any 
}

declare function fetchToCurl(
    url: string,
    options?: FetchOptions
): string;

export default fetchToCurl;

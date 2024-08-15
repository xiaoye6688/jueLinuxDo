var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
));

// node_modules/promise-limit/index.js
var require_promise_limit = __commonJS({
    "node_modules/promise-limit/index.js"(exports, module) {
        function limiter(count) {
            var outstanding = 0;
            var jobs = [];
            function remove() {
                outstanding--;
                if (outstanding < count) {
                    dequeue();
                }
            }
            function dequeue() {
                var job = jobs.shift();
                semaphore.queue = jobs.length;
                if (job) {
                    run(job.fn).then(job.resolve).catch(job.reject);
                }
            }
            function queue(fn) {
                return new Promise(function (resolve, reject) {
                    jobs.push({ fn, resolve, reject });
                    semaphore.queue = jobs.length;
                });
            }
            function run(fn) {
                outstanding++;
                try {
                    return Promise.resolve(fn()).then(function (result) {
                        remove();
                        return result;
                    }, function (error) {
                        remove();
                        throw error;
                    });
                } catch (err) {
                    remove();
                    return Promise.reject(err);
                }
            }
            var semaphore = function (fn) {
                if (outstanding >= count) {
                    return queue(fn);
                } else {
                    return run(fn);
                }
            };
            return semaphore;
        }
        function map(items, mapper) {
            var failed = false;
            var limit = this;
            return Promise.all(items.map(function () {
                var args = arguments;
                return limit(function () {
                    if (!failed) {
                        return mapper.apply(void 0, args).catch(function (e) {
                            failed = true;
                            throw e;
                        });
                    }
                });
            }));
        }
        function addExtras(fn) {
            fn.queue = 0;
            fn.map = map;
            return fn;
        }
        module.exports = function (count) {
            if (count) {
                return addExtras(limiter(count));
            } else {
                return addExtras(function (fn) {
                    return fn();
                });
            }
        };
    }
});

// node_modules/@libsql/core/lib-esm/api.js
var LibsqlError = class extends Error {
    /** Machine-readable error code. */
    code;
    /** Raw numeric error code */
    rawCode;
    constructor(message, code, rawCode, cause) {
        if (code !== void 0) {
            message = `${code}: ${message}`;
        }
        super(message, { cause });
        this.code = code;
        this.rawCode = rawCode;
        this.name = "LibsqlError";
    }
};

// node_modules/@libsql/core/lib-esm/uri.js
function parseUri(text) {
    const match = URI_RE.exec(text);
    if (match === null) {
        throw new LibsqlError(`The URL '${text}' is not in a valid format`, "URL_INVALID");
    }
    const groups = match.groups;
    const scheme = groups["scheme"];
    const authority = groups["authority"] !== void 0 ? parseAuthority(groups["authority"]) : void 0;
    const path = percentDecode(groups["path"]);
    const query = groups["query"] !== void 0 ? parseQuery(groups["query"]) : void 0;
    const fragment = groups["fragment"] !== void 0 ? percentDecode(groups["fragment"]) : void 0;
    return { scheme, authority, path, query, fragment };
}
var URI_RE = (() => {
    const SCHEME = "(?<scheme>[A-Za-z][A-Za-z.+-]*)";
    const AUTHORITY = "(?<authority>[^/?#]*)";
    const PATH = "(?<path>[^?#]*)";
    const QUERY = "(?<query>[^#]*)";
    const FRAGMENT = "(?<fragment>.*)";
    return new RegExp(`^${SCHEME}:(//${AUTHORITY})?${PATH}(\\?${QUERY})?(#${FRAGMENT})?$`, "su");
})();
function parseAuthority(text) {
    const match = AUTHORITY_RE.exec(text);
    if (match === null) {
        throw new LibsqlError("The authority part of the URL is not in a valid format", "URL_INVALID");
    }
    const groups = match.groups;
    const host = percentDecode(groups["host_br"] ?? groups["host"]);
    const port = groups["port"] ? parseInt(groups["port"], 10) : void 0;
    const userinfo = groups["username"] !== void 0 ? {
        username: percentDecode(groups["username"]),
        password: groups["password"] !== void 0 ? percentDecode(groups["password"]) : void 0
    } : void 0;
    return { host, port, userinfo };
}
var AUTHORITY_RE = (() => {
    return new RegExp(`^((?<username>[^:]*)(:(?<password>.*))?@)?((?<host>[^:\\[\\]]*)|(\\[(?<host_br>[^\\[\\]]*)\\]))(:(?<port>[0-9]*))?$`, "su");
})();
function parseQuery(text) {
    const sequences = text.split("&");
    const pairs = [];
    for (const sequence of sequences) {
        if (sequence === "") {
            continue;
        }
        let key;
        let value;
        const splitIdx = sequence.indexOf("=");
        if (splitIdx < 0) {
            key = sequence;
            value = "";
        } else {
            key = sequence.substring(0, splitIdx);
            value = sequence.substring(splitIdx + 1);
        }
        pairs.push({
            key: percentDecode(key.replaceAll("+", " ")),
            value: percentDecode(value.replaceAll("+", " "))
        });
    }
    return { pairs };
}
function percentDecode(text) {
    try {
        return decodeURIComponent(text);
    } catch (e) {
        if (e instanceof URIError) {
            throw new LibsqlError(`URL component has invalid percent encoding: ${e}`, "URL_INVALID", void 0, e);
        }
        throw e;
    }
}
function encodeBaseUrl(scheme, authority, path) {
    if (authority === void 0) {
        throw new LibsqlError(`URL with scheme ${JSON.stringify(scheme + ":")} requires authority (the "//" part)`, "URL_INVALID");
    }
    const schemeText = `${scheme}:`;
    const hostText = encodeHost(authority.host);
    const portText = encodePort(authority.port);
    const userinfoText = encodeUserinfo(authority.userinfo);
    const authorityText = `//${userinfoText}${hostText}${portText}`;
    let pathText = path.split("/").map(encodeURIComponent).join("/");
    if (pathText !== "" && !pathText.startsWith("/")) {
        pathText = "/" + pathText;
    }
    return new URL(`${schemeText}${authorityText}${pathText}`);
}
function encodeHost(host) {
    return host.includes(":") ? `[${encodeURI(host)}]` : encodeURI(host);
}
function encodePort(port) {
    return port !== void 0 ? `:${port}` : "";
}
function encodeUserinfo(userinfo) {
    if (userinfo === void 0) {
        return "";
    }
    const usernameText = encodeURIComponent(userinfo.username);
    const passwordText = userinfo.password !== void 0 ? `:${encodeURIComponent(userinfo.password)}` : "";
    return `${usernameText}${passwordText}@`;
}

// node_modules/js-base64/base64.mjs
var version = "3.7.7";
var VERSION = version;
var _hasBuffer = typeof Buffer === "function";
var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64chs = Array.prototype.slice.call(b64ch);
var b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
})(b64chs);
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var _fromCC = String.fromCharCode.bind(String);
var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
var _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
var _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
var btoaPolyfill = (bin) => {
    let u32, c0, c1, c2, asc = "";
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError("invalid character found");
        u32 = c0 << 16 | c1 << 8 | c2;
        asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
var _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
var _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
    const maxargs = 4096;
    let strs = [];
    for (let i = 0, l = u8a.length; i < l; i += maxargs) {
        strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
    }
    return _btoa(strs.join(""));
};
var fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
var cb_utob = (c) => {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    } else {
        var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
        return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    }
};
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = (u) => u.replace(re_utob, cb_utob);
var _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
var encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
var encodeURI2 = (src) => encode(src, true);
var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
var cb_btou = (cccc) => {
    switch (cccc.length) {
        case 4:
            var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
            return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
        case 3:
            return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
        default:
            return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
    }
};
var btou = (b) => b.replace(re_btou, cb_btou);
var atobPolyfill = (asc) => {
    asc = asc.replace(/\s+/g, "");
    if (!b64re.test(asc))
        throw new TypeError("malformed base64.");
    asc += "==".slice(2 - (asc.length & 3));
    let u24, bin = "", r1, r2;
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
        bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
};
var _atob = typeof atob === "function" ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
var _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
var toUint8Array = (a) => _toUint8Array(_unURI(a));
var _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
var _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
var decode = (src) => _decode(_unURI(src));
var isValid = (src) => {
    if (typeof src !== "string")
        return false;
    const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
var _noEnum = (v) => {
    return {
        value: v,
        enumerable: false,
        writable: true,
        configurable: true
    };
};
var extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add("fromBase64", function () {
        return decode(this);
    });
    _add("toBase64", function (urlsafe) {
        return encode(this, urlsafe);
    });
    _add("toBase64URI", function () {
        return encode(this, true);
    });
    _add("toBase64URL", function () {
        return encode(this, true);
    });
    _add("toUint8Array", function () {
        return toUint8Array(this);
    });
};
var extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add("toBase64", function (urlsafe) {
        return fromUint8Array(this, urlsafe);
    });
    _add("toBase64URI", function () {
        return fromUint8Array(this, true);
    });
    _add("toBase64URL", function () {
        return fromUint8Array(this, true);
    });
};
var extendBuiltins = () => {
    extendString();
    extendUint8Array();
};
var gBase64 = {
    version,
    VERSION,
    atob: _atob,
    atobPolyfill,
    btoa: _btoa,
    btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode,
    encodeURI: encodeURI2,
    encodeURL: encodeURI2,
    utob,
    btou,
    decode,
    isValid,
    fromUint8Array,
    toUint8Array,
    extendString,
    extendUint8Array,
    extendBuiltins
};

// node_modules/@libsql/core/lib-esm/util.js
var supportedUrlLink = "https://github.com/libsql/libsql-client-ts#supported-urls";
function transactionModeToBegin(mode) {
    if (mode === "write") {
        return "BEGIN IMMEDIATE";
    } else if (mode === "read") {
        return "BEGIN TRANSACTION READONLY";
    } else if (mode === "deferred") {
        return "BEGIN DEFERRED";
    } else {
        throw RangeError('Unknown transaction mode, supported values are "write", "read" and "deferred"');
    }
}
var ResultSetImpl = class {
    columns;
    columnTypes;
    rows;
    rowsAffected;
    lastInsertRowid;
    constructor(columns, columnTypes, rows, rowsAffected, lastInsertRowid) {
        this.columns = columns;
        this.columnTypes = columnTypes;
        this.rows = rows;
        this.rowsAffected = rowsAffected;
        this.lastInsertRowid = lastInsertRowid;
    }
    toJSON() {
        return {
            columns: this.columns,
            columnTypes: this.columnTypes,
            rows: this.rows.map(rowToJson),
            rowsAffected: this.rowsAffected,
            lastInsertRowid: this.lastInsertRowid !== void 0 ? "" + this.lastInsertRowid : null
        };
    }
};
function rowToJson(row) {
    return Array.prototype.map.call(row, valueToJson);
}
function valueToJson(value) {
    if (typeof value === "bigint") {
        return "" + value;
    } else if (value instanceof ArrayBuffer) {
        return gBase64.fromUint8Array(new Uint8Array(value));
    } else {
        return value;
    }
}

// node_modules/@libsql/core/lib-esm/config.js
var inMemoryMode = ":memory:";
function expandConfig(config, preferHttp) {
    if (typeof config !== "object") {
        throw new TypeError(`Expected client configuration as object, got ${typeof config}`);
    }
    let { url, authToken, tls, intMode, concurrency } = config;
    concurrency = Math.max(0, concurrency || 20);
    intMode ??= "number";
    let connectionQueryParams = [];
    if (url === inMemoryMode) {
        url = "file::memory:";
    }
    const uri = parseUri(url);
    const originalUriScheme = uri.scheme.toLowerCase();
    const isInMemoryMode = originalUriScheme === "file" && uri.path === inMemoryMode && uri.authority === void 0;
    let queryParamsDef;
    if (isInMemoryMode) {
        queryParamsDef = {
            cache: {
                values: ["shared", "private"],
                update: (key, value) => connectionQueryParams.push(`${key}=${value}`)
            }
        };
    } else {
        queryParamsDef = {
            tls: {
                values: ["0", "1"],
                update: (_, value) => tls = value === "1"
            },
            authToken: {
                update: (_, value) => authToken = value
            }
        };
    }
    for (const { key, value } of uri.query?.pairs ?? []) {
        if (!Object.hasOwn(queryParamsDef, key)) {
            throw new LibsqlError(`Unsupported URL query parameter ${JSON.stringify(key)}`, "URL_PARAM_NOT_SUPPORTED");
        }
        const queryParamDef = queryParamsDef[key];
        if (queryParamDef.values !== void 0 && !queryParamDef.values.includes(value)) {
            throw new LibsqlError(`Unknown value for the "${key}" query argument: ${JSON.stringify(value)}. Supported values are: [${queryParamDef.values.map((x) => '"' + x + '"').join(", ")}]`, "URL_INVALID");
        }
        if (queryParamDef.update !== void 0) {
            queryParamDef?.update(key, value);
        }
    }
    const connectionQueryParamsString = connectionQueryParams.length === 0 ? "" : `?${connectionQueryParams.join("&")}`;
    const path = uri.path + connectionQueryParamsString;
    let scheme;
    if (originalUriScheme === "libsql") {
        if (tls === false) {
            if (uri.authority?.port === void 0) {
                throw new LibsqlError('A "libsql:" URL with ?tls=0 must specify an explicit port', "URL_INVALID");
            }
            scheme = preferHttp ? "http" : "ws";
        } else {
            scheme = preferHttp ? "https" : "wss";
        }
    } else {
        scheme = originalUriScheme;
    }
    if (scheme === "http" || scheme === "ws") {
        tls ??= false;
    } else {
        tls ??= true;
    }
    if (scheme !== "http" && scheme !== "ws" && scheme !== "https" && scheme !== "wss" && scheme !== "file") {
        throw new LibsqlError(`The client supports only "libsql:", "wss:", "ws:", "https:", "http:" and "file:" URLs, got ${JSON.stringify(uri.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
    }
    if (intMode !== "number" && intMode !== "bigint" && intMode !== "string") {
        throw new TypeError(`Invalid value for intMode, expected "number", "bigint" or "string", got ${JSON.stringify(intMode)}`);
    }
    if (uri.fragment !== void 0) {
        throw new LibsqlError(`URL fragments are not supported: ${JSON.stringify("#" + uri.fragment)}`, "URL_INVALID");
    }
    if (isInMemoryMode) {
        return {
            scheme: "file",
            tls: false,
            path,
            intMode,
            concurrency,
            syncUrl: config.syncUrl,
            syncInterval: config.syncInterval,
            fetch: config.fetch,
            authToken: void 0,
            encryptionKey: void 0,
            authority: void 0
        };
    }
    return {
        scheme,
        tls,
        authority: uri.authority,
        path,
        authToken,
        intMode,
        concurrency,
        encryptionKey: config.encryptionKey,
        syncUrl: config.syncUrl,
        syncInterval: config.syncInterval,
        fetch: config.fetch
    };
}

// node_modules/@libsql/isomorphic-ws/web.mjs
var _WebSocket;
if (typeof WebSocket !== "undefined") {
    _WebSocket = WebSocket;
} else if (typeof global !== "undefined") {
    _WebSocket = global.WebSocket;
} else if (typeof window !== "undefined") {
    _WebSocket = window.WebSocket;
} else if (typeof self !== "undefined") {
    _WebSocket = self.WebSocket;
}

// node_modules/@libsql/hrana-client/lib-esm/client.js
var Client = class {
    /** @private */
    constructor() {
        this.intMode = "number";
    }
    /** Representation of integers returned from the database. See {@link IntMode}.
     *
     * This value is inherited by {@link Stream} objects created with {@link openStream}, but you can
     * override the integer mode for every stream by setting {@link Stream.intMode} on the stream.
     */
    intMode;
};

// node_modules/@libsql/hrana-client/lib-esm/errors.js
var ClientError = class extends Error {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "ClientError";
    }
};
var ProtoError = class extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "ProtoError";
    }
};
var ResponseError = class extends ClientError {
    code;
    /** @internal */
    proto;
    /** @private */
    constructor(message, protoError) {
        super(message);
        this.name = "ResponseError";
        this.code = protoError.code;
        this.proto = protoError;
        this.stack = void 0;
    }
};
var ClosedError = class extends ClientError {
    /** @private */
    constructor(message, cause) {
        if (cause !== void 0) {
            super(`${message}: ${cause}`);
            this.cause = cause;
        } else {
            super(message);
        }
        this.name = "ClosedError";
    }
};
var WebSocketUnsupportedError = class extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "WebSocketUnsupportedError";
    }
};
var WebSocketError = class extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "WebSocketError";
    }
};
var HttpServerError = class extends ClientError {
    status;
    /** @private */
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "HttpServerError";
    }
};
var ProtocolVersionError = class extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "ProtocolVersionError";
    }
};
var InternalError = class extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "InternalError";
    }
};
var MisuseError = class extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "MisuseError";
    }
};

// node_modules/@libsql/hrana-client/lib-esm/encoding/json/decode.js
function string(value) {
    if (typeof value === "string") {
        return value;
    }
    throw typeError(value, "string");
}
function stringOpt(value) {
    if (value === null || value === void 0) {
        return void 0;
    } else if (typeof value === "string") {
        return value;
    }
    throw typeError(value, "string or null");
}
function number(value) {
    if (typeof value === "number") {
        return value;
    }
    throw typeError(value, "number");
}
function boolean(value) {
    if (typeof value === "boolean") {
        return value;
    }
    throw typeError(value, "boolean");
}
function array(value) {
    if (Array.isArray(value)) {
        return value;
    }
    throw typeError(value, "array");
}
function object(value) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    throw typeError(value, "object");
}
function arrayObjectsMap(value, fun) {
    return array(value).map((elemValue) => fun(object(elemValue)));
}
function typeError(value, expected) {
    if (value === void 0) {
        return new ProtoError(`Expected ${expected}, but the property was missing`);
    }
    let received = typeof value;
    if (value === null) {
        received = "null";
    } else if (Array.isArray(value)) {
        received = "array";
    }
    return new ProtoError(`Expected ${expected}, received ${received}`);
}
function readJsonObject(value, fun) {
    return fun(object(value));
}

// node_modules/@libsql/hrana-client/lib-esm/encoding/json/encode.js
var ObjectWriter = class {
    #output;
    #isFirst;
    constructor(output) {
        this.#output = output;
        this.#isFirst = false;
    }
    begin() {
        this.#output.push("{");
        this.#isFirst = true;
    }
    end() {
        this.#output.push("}");
        this.#isFirst = false;
    }
    #key(name) {
        if (this.#isFirst) {
            this.#output.push('"');
            this.#isFirst = false;
        } else {
            this.#output.push(',"');
        }
        this.#output.push(name);
        this.#output.push('":');
    }
    string(name, value) {
        this.#key(name);
        this.#output.push(JSON.stringify(value));
    }
    stringRaw(name, value) {
        this.#key(name);
        this.#output.push('"');
        this.#output.push(value);
        this.#output.push('"');
    }
    number(name, value) {
        this.#key(name);
        this.#output.push("" + value);
    }
    boolean(name, value) {
        this.#key(name);
        this.#output.push(value ? "true" : "false");
    }
    object(name, value, valueFun) {
        this.#key(name);
        this.begin();
        valueFun(this, value);
        this.end();
    }
    arrayObjects(name, values, valueFun) {
        this.#key(name);
        this.#output.push("[");
        for (let i = 0; i < values.length; ++i) {
            if (i !== 0) {
                this.#output.push(",");
            }
            this.begin();
            valueFun(this, values[i]);
            this.end();
        }
        this.#output.push("]");
    }
};
function writeJsonObject(value, fun) {
    const output = [];
    const writer = new ObjectWriter(output);
    writer.begin();
    fun(writer, value);
    writer.end();
    return output.join("");
}

// node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/util.js
var VARINT = 0;
var FIXED_64 = 1;
var LENGTH_DELIMITED = 2;
var FIXED_32 = 5;

// node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/decode.js
var MessageReader = class {
    #array;
    #view;
    #pos;
    constructor(array2) {
        this.#array = array2;
        this.#view = new DataView(array2.buffer, array2.byteOffset, array2.byteLength);
        this.#pos = 0;
    }
    varint() {
        let value = 0;
        for (let shift = 0; ; shift += 7) {
            const byte = this.#array[this.#pos++];
            value |= (byte & 127) << shift;
            if (!(byte & 128)) {
                break;
            }
        }
        return value;
    }
    varintBig() {
        let value = 0n;
        for (let shift = 0n; ; shift += 7n) {
            const byte = this.#array[this.#pos++];
            value |= BigInt(byte & 127) << shift;
            if (!(byte & 128)) {
                break;
            }
        }
        return value;
    }
    bytes(length) {
        const array2 = new Uint8Array(this.#array.buffer, this.#array.byteOffset + this.#pos, length);
        this.#pos += length;
        return array2;
    }
    double() {
        const value = this.#view.getFloat64(this.#pos, true);
        this.#pos += 8;
        return value;
    }
    skipVarint() {
        for (; ;) {
            const byte = this.#array[this.#pos++];
            if (!(byte & 128)) {
                break;
            }
        }
    }
    skip(count) {
        this.#pos += count;
    }
    eof() {
        return this.#pos >= this.#array.byteLength;
    }
};
var FieldReader = class {
    #reader;
    #wireType;
    constructor(reader) {
        this.#reader = reader;
        this.#wireType = -1;
    }
    setup(wireType) {
        this.#wireType = wireType;
    }
    #expect(expectedWireType) {
        if (this.#wireType !== expectedWireType) {
            throw new ProtoError(`Expected wire type ${expectedWireType}, got ${this.#wireType}`);
        }
        this.#wireType = -1;
    }
    bytes() {
        this.#expect(LENGTH_DELIMITED);
        const length = this.#reader.varint();
        return this.#reader.bytes(length);
    }
    string() {
        return new TextDecoder().decode(this.bytes());
    }
    message(def) {
        return readProtobufMessage(this.bytes(), def);
    }
    int32() {
        this.#expect(VARINT);
        return this.#reader.varint();
    }
    uint32() {
        return this.int32();
    }
    bool() {
        return this.int32() !== 0;
    }
    uint64() {
        this.#expect(VARINT);
        return this.#reader.varintBig();
    }
    sint64() {
        const value = this.uint64();
        return value >> 1n ^ -(value & 1n);
    }
    double() {
        this.#expect(FIXED_64);
        return this.#reader.double();
    }
    maybeSkip() {
        if (this.#wireType < 0) {
            return;
        } else if (this.#wireType === VARINT) {
            this.#reader.skipVarint();
        } else if (this.#wireType === FIXED_64) {
            this.#reader.skip(8);
        } else if (this.#wireType === LENGTH_DELIMITED) {
            const length = this.#reader.varint();
            this.#reader.skip(length);
        } else if (this.#wireType === FIXED_32) {
            this.#reader.skip(4);
        } else {
            throw new ProtoError(`Unexpected wire type ${this.#wireType}`);
        }
        this.#wireType = -1;
    }
};
function readProtobufMessage(data, def) {
    const msgReader = new MessageReader(data);
    const fieldReader = new FieldReader(msgReader);
    let value = def.default();
    while (!msgReader.eof()) {
        const key = msgReader.varint();
        const tag = key >> 3;
        const wireType = key & 7;
        fieldReader.setup(wireType);
        const tagFun = def[tag];
        if (tagFun !== void 0) {
            const returnedValue = tagFun(fieldReader, value);
            if (returnedValue !== void 0) {
                value = returnedValue;
            }
        }
        fieldReader.maybeSkip();
    }
    return value;
}

// node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/encode.js
var MessageWriter = class {
    #buf;
    #array;
    #view;
    #pos;
    constructor() {
        this.#buf = new ArrayBuffer(256);
        this.#array = new Uint8Array(this.#buf);
        this.#view = new DataView(this.#buf);
        this.#pos = 0;
    }
    #ensure(extra) {
        if (this.#pos + extra <= this.#buf.byteLength) {
            return;
        }
        let newCap = this.#buf.byteLength;
        while (newCap < this.#pos + extra) {
            newCap *= 2;
        }
        const newBuf = new ArrayBuffer(newCap);
        const newArray = new Uint8Array(newBuf);
        const newView = new DataView(newBuf);
        newArray.set(new Uint8Array(this.#buf, 0, this.#pos));
        this.#buf = newBuf;
        this.#array = newArray;
        this.#view = newView;
    }
    #varint(value) {
        this.#ensure(5);
        value = 0 | value;
        do {
            let byte = value & 127;
            value >>>= 7;
            byte |= value ? 128 : 0;
            this.#array[this.#pos++] = byte;
        } while (value);
    }
    #varintBig(value) {
        this.#ensure(10);
        value = value & 0xffffffffffffffffn;
        do {
            let byte = Number(value & 0x7fn);
            value >>= 7n;
            byte |= value ? 128 : 0;
            this.#array[this.#pos++] = byte;
        } while (value);
    }
    #tag(tag, wireType) {
        this.#varint(tag << 3 | wireType);
    }
    bytes(tag, value) {
        this.#tag(tag, LENGTH_DELIMITED);
        this.#varint(value.byteLength);
        this.#ensure(value.byteLength);
        this.#array.set(value, this.#pos);
        this.#pos += value.byteLength;
    }
    string(tag, value) {
        this.bytes(tag, new TextEncoder().encode(value));
    }
    message(tag, value, fun) {
        const writer = new MessageWriter();
        fun(writer, value);
        this.bytes(tag, writer.data());
    }
    int32(tag, value) {
        this.#tag(tag, VARINT);
        this.#varint(value);
    }
    uint32(tag, value) {
        this.int32(tag, value);
    }
    bool(tag, value) {
        this.int32(tag, value ? 1 : 0);
    }
    sint64(tag, value) {
        this.#tag(tag, VARINT);
        this.#varintBig(value << 1n ^ value >> 63n);
    }
    double(tag, value) {
        this.#tag(tag, FIXED_64);
        this.#ensure(8);
        this.#view.setFloat64(this.#pos, value, true);
        this.#pos += 8;
    }
    data() {
        return new Uint8Array(this.#buf, 0, this.#pos);
    }
};
function writeProtobufMessage(value, fun) {
    const w = new MessageWriter();
    fun(w, value);
    return w.data();
}

// node_modules/@libsql/hrana-client/lib-esm/id_alloc.js
var IdAlloc = class {
    // Set of all allocated ids
    #usedIds;
    // Set of all free ids lower than `#usedIds.size`
    #freeIds;
    constructor() {
        this.#usedIds = /* @__PURE__ */ new Set();
        this.#freeIds = /* @__PURE__ */ new Set();
    }
    // Returns an id that was free, and marks it as used.
    alloc() {
        for (const freeId2 of this.#freeIds) {
            this.#freeIds.delete(freeId2);
            this.#usedIds.add(freeId2);
            if (!this.#usedIds.has(this.#usedIds.size - 1)) {
                this.#freeIds.add(this.#usedIds.size - 1);
            }
            return freeId2;
        }
        const freeId = this.#usedIds.size;
        this.#usedIds.add(freeId);
        return freeId;
    }
    free(id) {
        if (!this.#usedIds.delete(id)) {
            throw new InternalError("Freeing an id that is not allocated");
        }
        this.#freeIds.delete(this.#usedIds.size);
        if (id < this.#usedIds.size) {
            this.#freeIds.add(id);
        }
    }
};

// node_modules/@libsql/hrana-client/lib-esm/util.js
function impossible(value, message) {
    throw new InternalError(message);
}

// node_modules/@libsql/hrana-client/lib-esm/value.js
function valueToProto(value) {
    if (value === null) {
        return null;
    } else if (typeof value === "string") {
        return value;
    } else if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            throw new RangeError("Only finite numbers (not Infinity or NaN) can be passed as arguments");
        }
        return value;
    } else if (typeof value === "bigint") {
        if (value < minInteger || value > maxInteger) {
            throw new RangeError("This bigint value is too large to be represented as a 64-bit integer and passed as argument");
        }
        return value;
    } else if (typeof value === "boolean") {
        return value ? 1n : 0n;
    } else if (value instanceof ArrayBuffer) {
        return new Uint8Array(value);
    } else if (value instanceof Uint8Array) {
        return value;
    } else if (value instanceof Date) {
        return +value.valueOf();
    } else if (typeof value === "object") {
        return "" + value.toString();
    } else {
        throw new TypeError("Unsupported type of value");
    }
}
var minInteger = -9223372036854775808n;
var maxInteger = 9223372036854775807n;
function valueFromProto(value, intMode) {
    if (value === null) {
        return null;
    } else if (typeof value === "number") {
        return value;
    } else if (typeof value === "string") {
        return value;
    } else if (typeof value === "bigint") {
        if (intMode === "number") {
            const num = Number(value);
            if (!Number.isSafeInteger(num)) {
                throw new RangeError("Received integer which is too large to be safely represented as a JavaScript number");
            }
            return num;
        } else if (intMode === "bigint") {
            return value;
        } else if (intMode === "string") {
            return "" + value;
        } else {
            throw new MisuseError("Invalid value for IntMode");
        }
    } else if (value instanceof Uint8Array) {
        return value.slice().buffer;
    } else if (value === void 0) {
        throw new ProtoError("Received unrecognized type of Value");
    } else {
        throw impossible(value, "Impossible type of Value");
    }
}

// node_modules/@libsql/hrana-client/lib-esm/result.js
function stmtResultFromProto(result) {
    return {
        affectedRowCount: result.affectedRowCount,
        lastInsertRowid: result.lastInsertRowid,
        columnNames: result.cols.map((col) => col.name),
        columnDecltypes: result.cols.map((col) => col.decltype)
    };
}
function rowsResultFromProto(result, intMode) {
    const stmtResult = stmtResultFromProto(result);
    const rows = result.rows.map((row) => rowFromProto(stmtResult.columnNames, row, intMode));
    return { ...stmtResult, rows };
}
function rowResultFromProto(result, intMode) {
    const stmtResult = stmtResultFromProto(result);
    let row;
    if (result.rows.length > 0) {
        row = rowFromProto(stmtResult.columnNames, result.rows[0], intMode);
    }
    return { ...stmtResult, row };
}
function valueResultFromProto(result, intMode) {
    const stmtResult = stmtResultFromProto(result);
    let value;
    if (result.rows.length > 0 && stmtResult.columnNames.length > 0) {
        value = valueFromProto(result.rows[0][0], intMode);
    }
    return { ...stmtResult, value };
}
function rowFromProto(colNames, values, intMode) {
    const row = {};
    Object.defineProperty(row, "length", { value: values.length });
    for (let i = 0; i < values.length; ++i) {
        const value = valueFromProto(values[i], intMode);
        Object.defineProperty(row, i, { value });
        const colName = colNames[i];
        if (colName !== void 0 && !Object.hasOwn(row, colName)) {
            Object.defineProperty(row, colName, { value, enumerable: true, configurable: true, writable: true });
        }
    }
    return row;
}
function errorFromProto(error) {
    return new ResponseError(error.message, error);
}

// node_modules/@libsql/hrana-client/lib-esm/sql.js
var Sql = class {
    #owner;
    #sqlId;
    #closed;
    /** @private */
    constructor(owner, sqlId) {
        this.#owner = owner;
        this.#sqlId = sqlId;
        this.#closed = void 0;
    }
    /** @private */
    _getSqlId(owner) {
        if (this.#owner !== owner) {
            throw new MisuseError("Attempted to use SQL text opened with other object");
        } else if (this.#closed !== void 0) {
            throw new ClosedError("SQL text is closed", this.#closed);
        }
        return this.#sqlId;
    }
    /** Remove the SQL text from the server, releasing resouces. */
    close() {
        this._setClosed(new ClientError("SQL text was manually closed"));
    }
    /** @private */
    _setClosed(error) {
        if (this.#closed === void 0) {
            this.#closed = error;
            this.#owner._closeSql(this.#sqlId);
        }
    }
    /** True if the SQL text is closed (removed from the server). */
    get closed() {
        return this.#closed !== void 0;
    }
};
function sqlToProto(owner, sql) {
    if (sql instanceof Sql) {
        return { sqlId: sql._getSqlId(owner) };
    } else {
        return { sql: "" + sql };
    }
}

// node_modules/@libsql/hrana-client/lib-esm/queue.js
var Queue = class {
    #pushStack;
    #shiftStack;
    constructor() {
        this.#pushStack = [];
        this.#shiftStack = [];
    }
    get length() {
        return this.#pushStack.length + this.#shiftStack.length;
    }
    push(elem) {
        this.#pushStack.push(elem);
    }
    shift() {
        if (this.#shiftStack.length === 0 && this.#pushStack.length > 0) {
            this.#shiftStack = this.#pushStack.reverse();
            this.#pushStack = [];
        }
        return this.#shiftStack.pop();
    }
    first() {
        return this.#shiftStack.length !== 0 ? this.#shiftStack[this.#shiftStack.length - 1] : this.#pushStack[0];
    }
};

// node_modules/@libsql/hrana-client/lib-esm/stmt.js
var Stmt = class {
    /** The SQL statement text. */
    sql;
    /** @private */
    _args;
    /** @private */
    _namedArgs;
    /** Initialize the statement with given SQL text. */
    constructor(sql) {
        this.sql = sql;
        this._args = [];
        this._namedArgs = /* @__PURE__ */ new Map();
    }
    /** Binds positional parameters from the given `values`. All previous positional bindings are cleared. */
    bindIndexes(values) {
        this._args.length = 0;
        for (const value of values) {
            this._args.push(valueToProto(value));
        }
        return this;
    }
    /** Binds a parameter by a 1-based index. */
    bindIndex(index, value) {
        if (index !== (index | 0) || index <= 0) {
            throw new RangeError("Index of a positional argument must be positive integer");
        }
        while (this._args.length < index) {
            this._args.push(null);
        }
        this._args[index - 1] = valueToProto(value);
        return this;
    }
    /** Binds a parameter by name. */
    bindName(name, value) {
        this._namedArgs.set(name, valueToProto(value));
        return this;
    }
    /** Clears all bindings. */
    unbindAll() {
        this._args.length = 0;
        this._namedArgs.clear();
        return this;
    }
};
function stmtToProto(sqlOwner, stmt, wantRows) {
    let inSql;
    let args = [];
    let namedArgs = [];
    if (stmt instanceof Stmt) {
        inSql = stmt.sql;
        args = stmt._args;
        for (const [name, value] of stmt._namedArgs.entries()) {
            namedArgs.push({ name, value });
        }
    } else if (Array.isArray(stmt)) {
        inSql = stmt[0];
        if (Array.isArray(stmt[1])) {
            args = stmt[1].map((arg) => valueToProto(arg));
        } else {
            namedArgs = Object.entries(stmt[1]).map(([name, value]) => {
                return { name, value: valueToProto(value) };
            });
        }
    } else {
        inSql = stmt;
    }
    const { sql, sqlId } = sqlToProto(sqlOwner, inSql);
    return { sql, sqlId, args, namedArgs, wantRows };
}

// node_modules/@libsql/hrana-client/lib-esm/batch.js
var Batch = class {
    /** @private */
    _stream;
    #useCursor;
    /** @private */
    _steps;
    #executed;
    /** @private */
    constructor(stream, useCursor) {
        this._stream = stream;
        this.#useCursor = useCursor;
        this._steps = [];
        this.#executed = false;
    }
    /** Return a builder for adding a step to the batch. */
    step() {
        return new BatchStep(this);
    }
    /** Execute the batch. */
    execute() {
        if (this.#executed) {
            throw new MisuseError("This batch has already been executed");
        }
        this.#executed = true;
        const batch = {
            steps: this._steps.map((step) => step.proto)
        };
        if (this.#useCursor) {
            return executeCursor(this._stream, this._steps, batch);
        } else {
            return executeRegular(this._stream, this._steps, batch);
        }
    }
};
function executeRegular(stream, steps, batch) {
    return stream._batch(batch).then((result) => {
        for (let step = 0; step < steps.length; ++step) {
            const stepResult = result.stepResults.get(step);
            const stepError = result.stepErrors.get(step);
            steps[step].callback(stepResult, stepError);
        }
    });
}
async function executeCursor(stream, steps, batch) {
    const cursor = await stream._openCursor(batch);
    try {
        let nextStep = 0;
        let beginEntry = void 0;
        let rows = [];
        for (; ;) {
            const entry = await cursor.next();
            if (entry === void 0) {
                break;
            }
            if (entry.type === "step_begin") {
                if (entry.step < nextStep || entry.step >= steps.length) {
                    throw new ProtoError("Server produced StepBeginEntry for unexpected step");
                } else if (beginEntry !== void 0) {
                    throw new ProtoError("Server produced StepBeginEntry before terminating previous step");
                }
                for (let step = nextStep; step < entry.step; ++step) {
                    steps[step].callback(void 0, void 0);
                }
                nextStep = entry.step + 1;
                beginEntry = entry;
                rows = [];
            } else if (entry.type === "step_end") {
                if (beginEntry === void 0) {
                    throw new ProtoError("Server produced StepEndEntry but no step is active");
                }
                const stmtResult = {
                    cols: beginEntry.cols,
                    rows,
                    affectedRowCount: entry.affectedRowCount,
                    lastInsertRowid: entry.lastInsertRowid
                };
                steps[beginEntry.step].callback(stmtResult, void 0);
                beginEntry = void 0;
                rows = [];
            } else if (entry.type === "step_error") {
                if (beginEntry === void 0) {
                    if (entry.step >= steps.length) {
                        throw new ProtoError("Server produced StepErrorEntry for unexpected step");
                    }
                    for (let step = nextStep; step < entry.step; ++step) {
                        steps[step].callback(void 0, void 0);
                    }
                } else {
                    if (entry.step !== beginEntry.step) {
                        throw new ProtoError("Server produced StepErrorEntry for unexpected step");
                    }
                    beginEntry = void 0;
                    rows = [];
                }
                steps[entry.step].callback(void 0, entry.error);
                nextStep = entry.step + 1;
            } else if (entry.type === "row") {
                if (beginEntry === void 0) {
                    throw new ProtoError("Server produced RowEntry but no step is active");
                }
                rows.push(entry.row);
            } else if (entry.type === "error") {
                throw errorFromProto(entry.error);
            } else if (entry.type === "none") {
                throw new ProtoError("Server produced unrecognized CursorEntry");
            } else {
                throw impossible(entry, "Impossible CursorEntry");
            }
        }
        if (beginEntry !== void 0) {
            throw new ProtoError("Server closed Cursor before terminating active step");
        }
        for (let step = nextStep; step < steps.length; ++step) {
            steps[step].callback(void 0, void 0);
        }
    } finally {
        cursor.close();
    }
}
var BatchStep = class {
    /** @private */
    _batch;
    #conds;
    /** @private */
    _index;
    /** @private */
    constructor(batch) {
        this._batch = batch;
        this.#conds = [];
        this._index = void 0;
    }
    /** Add the condition that needs to be satisfied to execute the statement. If you use this method multiple
     * times, we join the conditions with a logical AND. */
    condition(cond) {
        this.#conds.push(cond._proto);
        return this;
    }
    /** Add a statement that returns rows. */
    query(stmt) {
        return this.#add(stmt, true, rowsResultFromProto);
    }
    /** Add a statement that returns at most a single row. */
    queryRow(stmt) {
        return this.#add(stmt, true, rowResultFromProto);
    }
    /** Add a statement that returns at most a single value. */
    queryValue(stmt) {
        return this.#add(stmt, true, valueResultFromProto);
    }
    /** Add a statement without returning rows. */
    run(stmt) {
        return this.#add(stmt, false, stmtResultFromProto);
    }
    #add(inStmt, wantRows, fromProto) {
        if (this._index !== void 0) {
            throw new MisuseError("This BatchStep has already been added to the batch");
        }
        const stmt = stmtToProto(this._batch._stream._sqlOwner(), inStmt, wantRows);
        let condition;
        if (this.#conds.length === 0) {
            condition = void 0;
        } else if (this.#conds.length === 1) {
            condition = this.#conds[0];
        } else {
            condition = { type: "and", conds: this.#conds.slice() };
        }
        const proto = { stmt, condition };
        return new Promise((outputCallback, errorCallback) => {
            const callback = (stepResult, stepError) => {
                if (stepResult !== void 0 && stepError !== void 0) {
                    errorCallback(new ProtoError("Server returned both result and error"));
                } else if (stepError !== void 0) {
                    errorCallback(errorFromProto(stepError));
                } else if (stepResult !== void 0) {
                    outputCallback(fromProto(stepResult, this._batch._stream.intMode));
                } else {
                    outputCallback(void 0);
                }
            };
            this._index = this._batch._steps.length;
            this._batch._steps.push({ proto, callback });
        });
    }
};
var BatchCond = class {
    /** @private */
    _batch;
    /** @private */
    _proto;
    /** @private */
    constructor(batch, proto) {
        this._batch = batch;
        this._proto = proto;
    }
    /** Create a condition that evaluates to true when the given step executes successfully.
     *
     * If the given step fails error or is skipped because its condition evaluated to false, this
     * condition evaluates to false.
     */
    static ok(step) {
        return new BatchCond(step._batch, { type: "ok", step: stepIndex(step) });
    }
    /** Create a condition that evaluates to true when the given step fails.
     *
     * If the given step succeeds or is skipped because its condition evaluated to false, this condition
     * evaluates to false.
     */
    static error(step) {
        return new BatchCond(step._batch, { type: "error", step: stepIndex(step) });
    }
    /** Create a condition that is a logical negation of another condition.
     */
    static not(cond) {
        return new BatchCond(cond._batch, { type: "not", cond: cond._proto });
    }
    /** Create a condition that is a logical AND of other conditions.
     */
    static and(batch, conds) {
        for (const cond of conds) {
            checkCondBatch(batch, cond);
        }
        return new BatchCond(batch, { type: "and", conds: conds.map((e) => e._proto) });
    }
    /** Create a condition that is a logical OR of other conditions.
     */
    static or(batch, conds) {
        for (const cond of conds) {
            checkCondBatch(batch, cond);
        }
        return new BatchCond(batch, { type: "or", conds: conds.map((e) => e._proto) });
    }
    /** Create a condition that evaluates to true when the SQL connection is in autocommit mode (not inside an
     * explicit transaction). This requires protocol version 3 or higher.
     */
    static isAutocommit(batch) {
        batch._stream.client()._ensureVersion(3, "BatchCond.isAutocommit()");
        return new BatchCond(batch, { type: "is_autocommit" });
    }
};
function stepIndex(step) {
    if (step._index === void 0) {
        throw new MisuseError("Cannot add a condition referencing a step that has not been added to the batch");
    }
    return step._index;
}
function checkCondBatch(expectedBatch, cond) {
    if (cond._batch !== expectedBatch) {
        throw new MisuseError("Cannot mix BatchCond objects for different Batch objects");
    }
}

// node_modules/@libsql/hrana-client/lib-esm/describe.js
function describeResultFromProto(result) {
    return {
        paramNames: result.params.map((p) => p.name),
        columns: result.cols,
        isExplain: result.isExplain,
        isReadonly: result.isReadonly
    };
}

// node_modules/@libsql/hrana-client/lib-esm/stream.js
var Stream = class {
    /** @private */
    constructor(intMode) {
        this.intMode = intMode;
    }
    /** Execute a statement and return rows. */
    query(stmt) {
        return this.#execute(stmt, true, rowsResultFromProto);
    }
    /** Execute a statement and return at most a single row. */
    queryRow(stmt) {
        return this.#execute(stmt, true, rowResultFromProto);
    }
    /** Execute a statement and return at most a single value. */
    queryValue(stmt) {
        return this.#execute(stmt, true, valueResultFromProto);
    }
    /** Execute a statement without returning rows. */
    run(stmt) {
        return this.#execute(stmt, false, stmtResultFromProto);
    }
    #execute(inStmt, wantRows, fromProto) {
        const stmt = stmtToProto(this._sqlOwner(), inStmt, wantRows);
        return this._execute(stmt).then((r) => fromProto(r, this.intMode));
    }
    /** Return a builder for creating and executing a batch.
     *
     * If `useCursor` is true, the batch will be executed using a Hrana cursor, which will stream results from
     * the server to the client, which consumes less memory on the server. This requires protocol version 3 or
     * higher.
     */
    batch(useCursor = false) {
        return new Batch(this, useCursor);
    }
    /** Parse and analyze a statement. This requires protocol version 2 or higher. */
    describe(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._describe(protoSql).then(describeResultFromProto);
    }
    /** Execute a sequence of statements separated by semicolons. This requires protocol version 2 or higher.
     * */
    sequence(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._sequence(protoSql);
    }
    /** Representation of integers returned from the database. See {@link IntMode}.
     *
     * This value affects the results of all operations on this stream.
     */
    intMode;
};

// node_modules/@libsql/hrana-client/lib-esm/cursor.js
var Cursor = class {
};

// node_modules/@libsql/hrana-client/lib-esm/ws/cursor.js
var fetchChunkSize = 1e3;
var fetchQueueSize = 10;
var WsCursor = class extends Cursor {
    #client;
    #stream;
    #cursorId;
    #entryQueue;
    #fetchQueue;
    #closed;
    #done;
    /** @private */
    constructor(client, stream, cursorId) {
        super();
        this.#client = client;
        this.#stream = stream;
        this.#cursorId = cursorId;
        this.#entryQueue = new Queue();
        this.#fetchQueue = new Queue();
        this.#closed = void 0;
        this.#done = false;
    }
    /** Fetch the next entry from the cursor. */
    async next() {
        for (; ;) {
            if (this.#closed !== void 0) {
                throw new ClosedError("Cursor is closed", this.#closed);
            }
            while (!this.#done && this.#fetchQueue.length < fetchQueueSize) {
                this.#fetchQueue.push(this.#fetch());
            }
            const entry = this.#entryQueue.shift();
            if (this.#done || entry !== void 0) {
                return entry;
            }
            await this.#fetchQueue.shift().then((response) => {
                if (response === void 0) {
                    return;
                }
                for (const entry2 of response.entries) {
                    this.#entryQueue.push(entry2);
                }
                this.#done ||= response.done;
            });
        }
    }
    #fetch() {
        return this.#stream._sendCursorRequest(this, {
            type: "fetch_cursor",
            cursorId: this.#cursorId,
            maxCount: fetchChunkSize
        }).then((resp) => resp, (error) => {
            this._setClosed(error);
            return void 0;
        });
    }
    /** @private */
    _setClosed(error) {
        if (this.#closed !== void 0) {
            return;
        }
        this.#closed = error;
        this.#stream._sendCursorRequest(this, {
            type: "close_cursor",
            cursorId: this.#cursorId
        }).catch(() => void 0);
        this.#stream._cursorClosed(this);
    }
    /** Close the cursor. */
    close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
    }
    /** True if the cursor is closed. */
    get closed() {
        return this.#closed !== void 0;
    }
};

// node_modules/@libsql/hrana-client/lib-esm/ws/stream.js
var WsStream = class extends Stream {
    #client;
    #streamId;
    #queue;
    #cursor;
    #closing;
    #closed;
    /** @private */
    static open(client) {
        const streamId = client._streamIdAlloc.alloc();
        const stream = new WsStream(client, streamId);
        const responseCallback = () => void 0;
        const errorCallback = (e) => stream.#setClosed(e);
        const request = { type: "open_stream", streamId };
        client._sendRequest(request, { responseCallback, errorCallback });
        return stream;
    }
    /** @private */
    constructor(client, streamId) {
        super(client.intMode);
        this.#client = client;
        this.#streamId = streamId;
        this.#queue = new Queue();
        this.#cursor = void 0;
        this.#closing = false;
        this.#closed = void 0;
    }
    /** Get the {@link WsClient} object that this stream belongs to. */
    client() {
        return this.#client;
    }
    /** @private */
    _sqlOwner() {
        return this.#client;
    }
    /** @private */
    _execute(stmt) {
        return this.#sendStreamRequest({
            type: "execute",
            streamId: this.#streamId,
            stmt
        }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _batch(batch) {
        return this.#sendStreamRequest({
            type: "batch",
            streamId: this.#streamId,
            batch
        }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _describe(protoSql) {
        this.#client._ensureVersion(2, "describe()");
        return this.#sendStreamRequest({
            type: "describe",
            streamId: this.#streamId,
            sql: protoSql.sql,
            sqlId: protoSql.sqlId
        }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _sequence(protoSql) {
        this.#client._ensureVersion(2, "sequence()");
        return this.#sendStreamRequest({
            type: "sequence",
            streamId: this.#streamId,
            sql: protoSql.sql,
            sqlId: protoSql.sqlId
        }).then((_response) => {
            return void 0;
        });
    }
    /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
     * explicit transaction). This requires protocol version 3 or higher.
     */
    getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
            type: "get_autocommit",
            streamId: this.#streamId
        }).then((response) => {
            return response.isAutocommit;
        });
    }
    #sendStreamRequest(request) {
        return new Promise((responseCallback, errorCallback) => {
            this.#pushToQueue({ type: "request", request, responseCallback, errorCallback });
        });
    }
    /** @private */
    _openCursor(batch) {
        this.#client._ensureVersion(3, "cursor");
        return new Promise((cursorCallback, errorCallback) => {
            this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
    }
    /** @private */
    _sendCursorRequest(cursor, request) {
        if (cursor !== this.#cursor) {
            throw new InternalError("Cursor not associated with the stream attempted to execute a request");
        }
        return new Promise((responseCallback, errorCallback) => {
            if (this.#closed !== void 0) {
                errorCallback(new ClosedError("Stream is closed", this.#closed));
            } else {
                this.#client._sendRequest(request, { responseCallback, errorCallback });
            }
        });
    }
    /** @private */
    _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
            throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = void 0;
        this.#flushQueue();
    }
    #pushToQueue(entry) {
        if (this.#closed !== void 0) {
            entry.errorCallback(new ClosedError("Stream is closed", this.#closed));
        } else if (this.#closing) {
            entry.errorCallback(new ClosedError("Stream is closing", void 0));
        } else {
            this.#queue.push(entry);
            this.#flushQueue();
        }
    }
    #flushQueue() {
        for (; ;) {
            const entry = this.#queue.first();
            if (entry === void 0 && this.#cursor === void 0 && this.#closing) {
                this.#setClosed(new ClientError("Stream was gracefully closed"));
                break;
            } else if (entry?.type === "request" && this.#cursor === void 0) {
                const { request, responseCallback, errorCallback } = entry;
                this.#queue.shift();
                this.#client._sendRequest(request, { responseCallback, errorCallback });
            } else if (entry?.type === "cursor" && this.#cursor === void 0) {
                const { batch, cursorCallback } = entry;
                this.#queue.shift();
                const cursorId = this.#client._cursorIdAlloc.alloc();
                const cursor = new WsCursor(this.#client, this, cursorId);
                const request = {
                    type: "open_cursor",
                    streamId: this.#streamId,
                    cursorId,
                    batch
                };
                const responseCallback = () => void 0;
                const errorCallback = (e) => cursor._setClosed(e);
                this.#client._sendRequest(request, { responseCallback, errorCallback });
                this.#cursor = cursor;
                cursorCallback(cursor);
            } else {
                break;
            }
        }
    }
    #setClosed(error) {
        if (this.#closed !== void 0) {
            return;
        }
        this.#closed = error;
        if (this.#cursor !== void 0) {
            this.#cursor._setClosed(error);
        }
        for (; ;) {
            const entry = this.#queue.shift();
            if (entry !== void 0) {
                entry.errorCallback(error);
            } else {
                break;
            }
        }
        const request = { type: "close_stream", streamId: this.#streamId };
        const responseCallback = () => this.#client._streamIdAlloc.free(this.#streamId);
        const errorCallback = () => void 0;
        this.#client._sendRequest(request, { responseCallback, errorCallback });
    }
    /** Immediately close the stream. */
    close() {
        this.#setClosed(new ClientError("Stream was manually closed"));
    }
    /** Gracefully close the stream. */
    closeGracefully() {
        this.#closing = true;
        this.#flushQueue();
    }
    /** True if the stream is closed or closing. */
    get closed() {
        return this.#closed !== void 0 || this.#closing;
    }
};

// node_modules/@libsql/hrana-client/lib-esm/shared/json_encode.js
function Stmt2(w, msg) {
    if (msg.sql !== void 0) {
        w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
        w.number("sql_id", msg.sqlId);
    }
    w.arrayObjects("args", msg.args, Value);
    w.arrayObjects("named_args", msg.namedArgs, NamedArg);
    w.boolean("want_rows", msg.wantRows);
}
function NamedArg(w, msg) {
    w.string("name", msg.name);
    w.object("value", msg.value, Value);
}
function Batch2(w, msg) {
    w.arrayObjects("steps", msg.steps, BatchStep2);
}
function BatchStep2(w, msg) {
    if (msg.condition !== void 0) {
        w.object("condition", msg.condition, BatchCond2);
    }
    w.object("stmt", msg.stmt, Stmt2);
}
function BatchCond2(w, msg) {
    w.stringRaw("type", msg.type);
    if (msg.type === "ok" || msg.type === "error") {
        w.number("step", msg.step);
    } else if (msg.type === "not") {
        w.object("cond", msg.cond, BatchCond2);
    } else if (msg.type === "and" || msg.type === "or") {
        w.arrayObjects("conds", msg.conds, BatchCond2);
    } else if (msg.type === "is_autocommit") {
    } else {
        throw impossible(msg, "Impossible type of BatchCond");
    }
}
function Value(w, msg) {
    if (msg === null) {
        w.stringRaw("type", "null");
    } else if (typeof msg === "bigint") {
        w.stringRaw("type", "integer");
        w.stringRaw("value", "" + msg);
    } else if (typeof msg === "number") {
        w.stringRaw("type", "float");
        w.number("value", msg);
    } else if (typeof msg === "string") {
        w.stringRaw("type", "text");
        w.string("value", msg);
    } else if (msg instanceof Uint8Array) {
        w.stringRaw("type", "blob");
        w.stringRaw("base64", gBase64.fromUint8Array(msg));
    } else if (msg === void 0) {
    } else {
        throw impossible(msg, "Impossible type of Value");
    }
}

// node_modules/@libsql/hrana-client/lib-esm/ws/json_encode.js
function ClientMsg(w, msg) {
    w.stringRaw("type", msg.type);
    if (msg.type === "hello") {
        if (msg.jwt !== void 0) {
            w.string("jwt", msg.jwt);
        }
    } else if (msg.type === "request") {
        w.number("request_id", msg.requestId);
        w.object("request", msg.request, Request2);
    } else {
        throw impossible(msg, "Impossible type of ClientMsg");
    }
}
function Request2(w, msg) {
    w.stringRaw("type", msg.type);
    if (msg.type === "open_stream") {
        w.number("stream_id", msg.streamId);
    } else if (msg.type === "close_stream") {
        w.number("stream_id", msg.streamId);
    } else if (msg.type === "execute") {
        w.number("stream_id", msg.streamId);
        w.object("stmt", msg.stmt, Stmt2);
    } else if (msg.type === "batch") {
        w.number("stream_id", msg.streamId);
        w.object("batch", msg.batch, Batch2);
    } else if (msg.type === "open_cursor") {
        w.number("stream_id", msg.streamId);
        w.number("cursor_id", msg.cursorId);
        w.object("batch", msg.batch, Batch2);
    } else if (msg.type === "close_cursor") {
        w.number("cursor_id", msg.cursorId);
    } else if (msg.type === "fetch_cursor") {
        w.number("cursor_id", msg.cursorId);
        w.number("max_count", msg.maxCount);
    } else if (msg.type === "sequence") {
        w.number("stream_id", msg.streamId);
        if (msg.sql !== void 0) {
            w.string("sql", msg.sql);
        }
        if (msg.sqlId !== void 0) {
            w.number("sql_id", msg.sqlId);
        }
    } else if (msg.type === "describe") {
        w.number("stream_id", msg.streamId);
        if (msg.sql !== void 0) {
            w.string("sql", msg.sql);
        }
        if (msg.sqlId !== void 0) {
            w.number("sql_id", msg.sqlId);
        }
    } else if (msg.type === "store_sql") {
        w.number("sql_id", msg.sqlId);
        w.string("sql", msg.sql);
    } else if (msg.type === "close_sql") {
        w.number("sql_id", msg.sqlId);
    } else if (msg.type === "get_autocommit") {
        w.number("stream_id", msg.streamId);
    } else {
        throw impossible(msg, "Impossible type of Request");
    }
}

// node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_encode.js
function Stmt3(w, msg) {
    if (msg.sql !== void 0) {
        w.string(1, msg.sql);
    }
    if (msg.sqlId !== void 0) {
        w.int32(2, msg.sqlId);
    }
    for (const arg of msg.args) {
        w.message(3, arg, Value2);
    }
    for (const arg of msg.namedArgs) {
        w.message(4, arg, NamedArg2);
    }
    w.bool(5, msg.wantRows);
}
function NamedArg2(w, msg) {
    w.string(1, msg.name);
    w.message(2, msg.value, Value2);
}
function Batch3(w, msg) {
    for (const step of msg.steps) {
        w.message(1, step, BatchStep3);
    }
}
function BatchStep3(w, msg) {
    if (msg.condition !== void 0) {
        w.message(1, msg.condition, BatchCond3);
    }
    w.message(2, msg.stmt, Stmt3);
}
function BatchCond3(w, msg) {
    if (msg.type === "ok") {
        w.uint32(1, msg.step);
    } else if (msg.type === "error") {
        w.uint32(2, msg.step);
    } else if (msg.type === "not") {
        w.message(3, msg.cond, BatchCond3);
    } else if (msg.type === "and") {
        w.message(4, msg.conds, BatchCondList);
    } else if (msg.type === "or") {
        w.message(5, msg.conds, BatchCondList);
    } else if (msg.type === "is_autocommit") {
        w.message(6, void 0, Empty);
    } else {
        throw impossible(msg, "Impossible type of BatchCond");
    }
}
function BatchCondList(w, msg) {
    for (const cond of msg) {
        w.message(1, cond, BatchCond3);
    }
}
function Value2(w, msg) {
    if (msg === null) {
        w.message(1, void 0, Empty);
    } else if (typeof msg === "bigint") {
        w.sint64(2, msg);
    } else if (typeof msg === "number") {
        w.double(3, msg);
    } else if (typeof msg === "string") {
        w.string(4, msg);
    } else if (msg instanceof Uint8Array) {
        w.bytes(5, msg);
    } else if (msg === void 0) {
    } else {
        throw impossible(msg, "Impossible type of Value");
    }
}
function Empty(_w, _msg) {
}

// node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_encode.js
function ClientMsg2(w, msg) {
    if (msg.type === "hello") {
        w.message(1, msg, HelloMsg);
    } else if (msg.type === "request") {
        w.message(2, msg, RequestMsg);
    } else {
        throw impossible(msg, "Impossible type of ClientMsg");
    }
}
function HelloMsg(w, msg) {
    if (msg.jwt !== void 0) {
        w.string(1, msg.jwt);
    }
}
function RequestMsg(w, msg) {
    w.int32(1, msg.requestId);
    const request = msg.request;
    if (request.type === "open_stream") {
        w.message(2, request, OpenStreamReq);
    } else if (request.type === "close_stream") {
        w.message(3, request, CloseStreamReq);
    } else if (request.type === "execute") {
        w.message(4, request, ExecuteReq);
    } else if (request.type === "batch") {
        w.message(5, request, BatchReq);
    } else if (request.type === "open_cursor") {
        w.message(6, request, OpenCursorReq);
    } else if (request.type === "close_cursor") {
        w.message(7, request, CloseCursorReq);
    } else if (request.type === "fetch_cursor") {
        w.message(8, request, FetchCursorReq);
    } else if (request.type === "sequence") {
        w.message(9, request, SequenceReq);
    } else if (request.type === "describe") {
        w.message(10, request, DescribeReq);
    } else if (request.type === "store_sql") {
        w.message(11, request, StoreSqlReq);
    } else if (request.type === "close_sql") {
        w.message(12, request, CloseSqlReq);
    } else if (request.type === "get_autocommit") {
        w.message(13, request, GetAutocommitReq);
    } else {
        throw impossible(request, "Impossible type of Request");
    }
}
function OpenStreamReq(w, msg) {
    w.int32(1, msg.streamId);
}
function CloseStreamReq(w, msg) {
    w.int32(1, msg.streamId);
}
function ExecuteReq(w, msg) {
    w.int32(1, msg.streamId);
    w.message(2, msg.stmt, Stmt3);
}
function BatchReq(w, msg) {
    w.int32(1, msg.streamId);
    w.message(2, msg.batch, Batch3);
}
function OpenCursorReq(w, msg) {
    w.int32(1, msg.streamId);
    w.int32(2, msg.cursorId);
    w.message(3, msg.batch, Batch3);
}
function CloseCursorReq(w, msg) {
    w.int32(1, msg.cursorId);
}
function FetchCursorReq(w, msg) {
    w.int32(1, msg.cursorId);
    w.uint32(2, msg.maxCount);
}
function SequenceReq(w, msg) {
    w.int32(1, msg.streamId);
    if (msg.sql !== void 0) {
        w.string(2, msg.sql);
    }
    if (msg.sqlId !== void 0) {
        w.int32(3, msg.sqlId);
    }
}
function DescribeReq(w, msg) {
    w.int32(1, msg.streamId);
    if (msg.sql !== void 0) {
        w.string(2, msg.sql);
    }
    if (msg.sqlId !== void 0) {
        w.int32(3, msg.sqlId);
    }
}
function StoreSqlReq(w, msg) {
    w.int32(1, msg.sqlId);
    w.string(2, msg.sql);
}
function CloseSqlReq(w, msg) {
    w.int32(1, msg.sqlId);
}
function GetAutocommitReq(w, msg) {
    w.int32(1, msg.streamId);
}

// node_modules/@libsql/hrana-client/lib-esm/shared/json_decode.js
function Error2(obj) {
    const message = string(obj["message"]);
    const code = stringOpt(obj["code"]);
    return { message, code };
}
function StmtResult(obj) {
    const cols = arrayObjectsMap(obj["cols"], Col);
    const rows = array(obj["rows"]).map((rowObj) => arrayObjectsMap(rowObj, Value3));
    const affectedRowCount = number(obj["affected_row_count"]);
    const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
    const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
    return { cols, rows, affectedRowCount, lastInsertRowid };
}
function Col(obj) {
    const name = stringOpt(obj["name"]);
    const decltype = stringOpt(obj["decltype"]);
    return { name, decltype };
}
function BatchResult(obj) {
    const stepResults = /* @__PURE__ */ new Map();
    array(obj["step_results"]).forEach((value, i) => {
        if (value !== null) {
            stepResults.set(i, StmtResult(object(value)));
        }
    });
    const stepErrors = /* @__PURE__ */ new Map();
    array(obj["step_errors"]).forEach((value, i) => {
        if (value !== null) {
            stepErrors.set(i, Error2(object(value)));
        }
    });
    return { stepResults, stepErrors };
}
function CursorEntry(obj) {
    const type = string(obj["type"]);
    if (type === "step_begin") {
        const step = number(obj["step"]);
        const cols = arrayObjectsMap(obj["cols"], Col);
        return { type: "step_begin", step, cols };
    } else if (type === "step_end") {
        const affectedRowCount = number(obj["affected_row_count"]);
        const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
        const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
        return { type: "step_end", affectedRowCount, lastInsertRowid };
    } else if (type === "step_error") {
        const step = number(obj["step"]);
        const error = Error2(object(obj["error"]));
        return { type: "step_error", step, error };
    } else if (type === "row") {
        const row = arrayObjectsMap(obj["row"], Value3);
        return { type: "row", row };
    } else if (type === "error") {
        const error = Error2(object(obj["error"]));
        return { type: "error", error };
    } else {
        throw new ProtoError("Unexpected type of CursorEntry");
    }
}
function DescribeResult(obj) {
    const params = arrayObjectsMap(obj["params"], DescribeParam);
    const cols = arrayObjectsMap(obj["cols"], DescribeCol);
    const isExplain = boolean(obj["is_explain"]);
    const isReadonly = boolean(obj["is_readonly"]);
    return { params, cols, isExplain, isReadonly };
}
function DescribeParam(obj) {
    const name = stringOpt(obj["name"]);
    return { name };
}
function DescribeCol(obj) {
    const name = string(obj["name"]);
    const decltype = stringOpt(obj["decltype"]);
    return { name, decltype };
}
function Value3(obj) {
    const type = string(obj["type"]);
    if (type === "null") {
        return null;
    } else if (type === "integer") {
        const value = string(obj["value"]);
        return BigInt(value);
    } else if (type === "float") {
        return number(obj["value"]);
    } else if (type === "text") {
        return string(obj["value"]);
    } else if (type === "blob") {
        return gBase64.toUint8Array(string(obj["base64"]));
    } else {
        throw new ProtoError("Unexpected type of Value");
    }
}

// node_modules/@libsql/hrana-client/lib-esm/ws/json_decode.js
function ServerMsg(obj) {
    const type = string(obj["type"]);
    if (type === "hello_ok") {
        return { type: "hello_ok" };
    } else if (type === "hello_error") {
        const error = Error2(object(obj["error"]));
        return { type: "hello_error", error };
    } else if (type === "response_ok") {
        const requestId = number(obj["request_id"]);
        const response = Response2(object(obj["response"]));
        return { type: "response_ok", requestId, response };
    } else if (type === "response_error") {
        const requestId = number(obj["request_id"]);
        const error = Error2(object(obj["error"]));
        return { type: "response_error", requestId, error };
    } else {
        throw new ProtoError("Unexpected type of ServerMsg");
    }
}
function Response2(obj) {
    const type = string(obj["type"]);
    if (type === "open_stream") {
        return { type: "open_stream" };
    } else if (type === "close_stream") {
        return { type: "close_stream" };
    } else if (type === "execute") {
        const result = StmtResult(object(obj["result"]));
        return { type: "execute", result };
    } else if (type === "batch") {
        const result = BatchResult(object(obj["result"]));
        return { type: "batch", result };
    } else if (type === "open_cursor") {
        return { type: "open_cursor" };
    } else if (type === "close_cursor") {
        return { type: "close_cursor" };
    } else if (type === "fetch_cursor") {
        const entries = arrayObjectsMap(obj["entries"], CursorEntry);
        const done = boolean(obj["done"]);
        return { type: "fetch_cursor", entries, done };
    } else if (type === "sequence") {
        return { type: "sequence" };
    } else if (type === "describe") {
        const result = DescribeResult(object(obj["result"]));
        return { type: "describe", result };
    } else if (type === "store_sql") {
        return { type: "store_sql" };
    } else if (type === "close_sql") {
        return { type: "close_sql" };
    } else if (type === "get_autocommit") {
        const isAutocommit = boolean(obj["is_autocommit"]);
        return { type: "get_autocommit", isAutocommit };
    } else {
        throw new ProtoError("Unexpected type of Response");
    }
}

// node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_decode.js
var Error3 = {
    default() {
        return { message: "", code: void 0 };
    },
    1(r, msg) {
        msg.message = r.string();
    },
    2(r, msg) {
        msg.code = r.string();
    }
};
var StmtResult2 = {
    default() {
        return {
            cols: [],
            rows: [],
            affectedRowCount: 0,
            lastInsertRowid: void 0
        };
    },
    1(r, msg) {
        msg.cols.push(r.message(Col2));
    },
    2(r, msg) {
        msg.rows.push(r.message(Row));
    },
    3(r, msg) {
        msg.affectedRowCount = Number(r.uint64());
    },
    4(r, msg) {
        msg.lastInsertRowid = r.sint64();
    }
};
var Col2 = {
    default() {
        return { name: void 0, decltype: void 0 };
    },
    1(r, msg) {
        msg.name = r.string();
    },
    2(r, msg) {
        msg.decltype = r.string();
    }
};
var Row = {
    default() {
        return [];
    },
    1(r, msg) {
        msg.push(r.message(Value4));
    }
};
var BatchResult2 = {
    default() {
        return { stepResults: /* @__PURE__ */ new Map(), stepErrors: /* @__PURE__ */ new Map() };
    },
    1(r, msg) {
        const [key, value] = r.message(BatchResultStepResult);
        msg.stepResults.set(key, value);
    },
    2(r, msg) {
        const [key, value] = r.message(BatchResultStepError);
        msg.stepErrors.set(key, value);
    }
};
var BatchResultStepResult = {
    default() {
        return [0, StmtResult2.default()];
    },
    1(r, msg) {
        msg[0] = r.uint32();
    },
    2(r, msg) {
        msg[1] = r.message(StmtResult2);
    }
};
var BatchResultStepError = {
    default() {
        return [0, Error3.default()];
    },
    1(r, msg) {
        msg[0] = r.uint32();
    },
    2(r, msg) {
        msg[1] = r.message(Error3);
    }
};
var CursorEntry2 = {
    default() {
        return { type: "none" };
    },
    1(r) {
        return r.message(StepBeginEntry);
    },
    2(r) {
        return r.message(StepEndEntry);
    },
    3(r) {
        return r.message(StepErrorEntry);
    },
    4(r) {
        return { type: "row", row: r.message(Row) };
    },
    5(r) {
        return { type: "error", error: r.message(Error3) };
    }
};
var StepBeginEntry = {
    default() {
        return { type: "step_begin", step: 0, cols: [] };
    },
    1(r, msg) {
        msg.step = r.uint32();
    },
    2(r, msg) {
        msg.cols.push(r.message(Col2));
    }
};
var StepEndEntry = {
    default() {
        return {
            type: "step_end",
            affectedRowCount: 0,
            lastInsertRowid: void 0
        };
    },
    1(r, msg) {
        msg.affectedRowCount = r.uint32();
    },
    2(r, msg) {
        msg.lastInsertRowid = r.uint64();
    }
};
var StepErrorEntry = {
    default() {
        return {
            type: "step_error",
            step: 0,
            error: Error3.default()
        };
    },
    1(r, msg) {
        msg.step = r.uint32();
    },
    2(r, msg) {
        msg.error = r.message(Error3);
    }
};
var DescribeResult2 = {
    default() {
        return {
            params: [],
            cols: [],
            isExplain: false,
            isReadonly: false
        };
    },
    1(r, msg) {
        msg.params.push(r.message(DescribeParam2));
    },
    2(r, msg) {
        msg.cols.push(r.message(DescribeCol2));
    },
    3(r, msg) {
        msg.isExplain = r.bool();
    },
    4(r, msg) {
        msg.isReadonly = r.bool();
    }
};
var DescribeParam2 = {
    default() {
        return { name: void 0 };
    },
    1(r, msg) {
        msg.name = r.string();
    }
};
var DescribeCol2 = {
    default() {
        return { name: "", decltype: void 0 };
    },
    1(r, msg) {
        msg.name = r.string();
    },
    2(r, msg) {
        msg.decltype = r.string();
    }
};
var Value4 = {
    default() {
        return void 0;
    },
    1(r) {
        return null;
    },
    2(r) {
        return r.sint64();
    },
    3(r) {
        return r.double();
    },
    4(r) {
        return r.string();
    },
    5(r) {
        return r.bytes();
    }
};

// node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_decode.js
var ServerMsg2 = {
    default() {
        return { type: "none" };
    },
    1(r) {
        return { type: "hello_ok" };
    },
    2(r) {
        return r.message(HelloErrorMsg);
    },
    3(r) {
        return r.message(ResponseOkMsg);
    },
    4(r) {
        return r.message(ResponseErrorMsg);
    }
};
var HelloErrorMsg = {
    default() {
        return { type: "hello_error", error: Error3.default() };
    },
    1(r, msg) {
        msg.error = r.message(Error3);
    }
};
var ResponseErrorMsg = {
    default() {
        return { type: "response_error", requestId: 0, error: Error3.default() };
    },
    1(r, msg) {
        msg.requestId = r.int32();
    },
    2(r, msg) {
        msg.error = r.message(Error3);
    }
};
var ResponseOkMsg = {
    default() {
        return {
            type: "response_ok",
            requestId: 0,
            response: { type: "none" }
        };
    },
    1(r, msg) {
        msg.requestId = r.int32();
    },
    2(r, msg) {
        msg.response = { type: "open_stream" };
    },
    3(r, msg) {
        msg.response = { type: "close_stream" };
    },
    4(r, msg) {
        msg.response = r.message(ExecuteResp);
    },
    5(r, msg) {
        msg.response = r.message(BatchResp);
    },
    6(r, msg) {
        msg.response = { type: "open_cursor" };
    },
    7(r, msg) {
        msg.response = { type: "close_cursor" };
    },
    8(r, msg) {
        msg.response = r.message(FetchCursorResp);
    },
    9(r, msg) {
        msg.response = { type: "sequence" };
    },
    10(r, msg) {
        msg.response = r.message(DescribeResp);
    },
    11(r, msg) {
        msg.response = { type: "store_sql" };
    },
    12(r, msg) {
        msg.response = { type: "close_sql" };
    },
    13(r, msg) {
        msg.response = r.message(GetAutocommitResp);
    }
};
var ExecuteResp = {
    default() {
        return { type: "execute", result: StmtResult2.default() };
    },
    1(r, msg) {
        msg.result = r.message(StmtResult2);
    }
};
var BatchResp = {
    default() {
        return { type: "batch", result: BatchResult2.default() };
    },
    1(r, msg) {
        msg.result = r.message(BatchResult2);
    }
};
var FetchCursorResp = {
    default() {
        return { type: "fetch_cursor", entries: [], done: false };
    },
    1(r, msg) {
        msg.entries.push(r.message(CursorEntry2));
    },
    2(r, msg) {
        msg.done = r.bool();
    }
};
var DescribeResp = {
    default() {
        return { type: "describe", result: DescribeResult2.default() };
    },
    1(r, msg) {
        msg.result = r.message(DescribeResult2);
    }
};
var GetAutocommitResp = {
    default() {
        return { type: "get_autocommit", isAutocommit: false };
    },
    1(r, msg) {
        msg.isAutocommit = r.bool();
    }
};

// node_modules/@libsql/hrana-client/lib-esm/ws/client.js
var subprotocolsV2 = /* @__PURE__ */ new Map([
    ["hrana2", { version: 2, encoding: "json" }],
    ["hrana1", { version: 1, encoding: "json" }]
]);
var subprotocolsV3 = /* @__PURE__ */ new Map([
    ["hrana3-protobuf", { version: 3, encoding: "protobuf" }],
    ["hrana3", { version: 3, encoding: "json" }],
    ["hrana2", { version: 2, encoding: "json" }],
    ["hrana1", { version: 1, encoding: "json" }]
]);
var WsClient = class extends Client {
    #socket;
    // List of callbacks that we queue until the socket transitions from the CONNECTING to the OPEN state.
    #openCallbacks;
    // Have we already transitioned from CONNECTING to OPEN and fired the callbacks in #openCallbacks?
    #opened;
    // Stores the error that caused us to close the client (and the socket). If we are not closed, this is
    // `undefined`.
    #closed;
    // Have we received a response to our "hello" from the server?
    #recvdHello;
    // Subprotocol negotiated with the server. It is only available after the socket transitions to the OPEN
    // state.
    #subprotocol;
    // Has the `getVersion()` function been called? This is only used to validate that the API is used
    // correctly.
    #getVersionCalled;
    // A map from request id to the responses that we expect to receive from the server.
    #responseMap;
    // An allocator of request ids.
    #requestIdAlloc;
    // An allocator of stream ids.
    /** @private */
    _streamIdAlloc;
    // An allocator of cursor ids.
    /** @private */
    _cursorIdAlloc;
    // An allocator of SQL text ids.
    #sqlIdAlloc;
    /** @private */
    constructor(socket, jwt) {
        super();
        this.#socket = socket;
        this.#openCallbacks = [];
        this.#opened = false;
        this.#closed = void 0;
        this.#recvdHello = false;
        this.#subprotocol = void 0;
        this.#getVersionCalled = false;
        this.#responseMap = /* @__PURE__ */ new Map();
        this.#requestIdAlloc = new IdAlloc();
        this._streamIdAlloc = new IdAlloc();
        this._cursorIdAlloc = new IdAlloc();
        this.#sqlIdAlloc = new IdAlloc();
        this.#socket.binaryType = "arraybuffer";
        this.#socket.addEventListener("open", () => this.#onSocketOpen());
        this.#socket.addEventListener("close", (event) => this.#onSocketClose(event));
        this.#socket.addEventListener("error", (event) => this.#onSocketError(event));
        this.#socket.addEventListener("message", (event) => this.#onSocketMessage(event));
        this.#send({ type: "hello", jwt });
    }
    // Send (or enqueue to send) a message to the server.
    #send(msg) {
        if (this.#closed !== void 0) {
            throw new InternalError("Trying to send a message on a closed client");
        }
        if (this.#opened) {
            this.#sendToSocket(msg);
        } else {
            const openCallback = () => this.#sendToSocket(msg);
            const errorCallback = () => void 0;
            this.#openCallbacks.push({ openCallback, errorCallback });
        }
    }
    // The socket transitioned from CONNECTING to OPEN
    #onSocketOpen() {
        const protocol = this.#socket.protocol;
        if (protocol === void 0) {
            this.#setClosed(new ClientError("The `WebSocket.protocol` property is undefined. This most likely means that the WebSocket implementation provided by the environment is broken. If you are using Miniflare 2, please update to Miniflare 3, which fixes this problem."));
            return;
        } else if (protocol === "") {
            this.#subprotocol = { version: 1, encoding: "json" };
        } else {
            this.#subprotocol = subprotocolsV3.get(protocol);
            if (this.#subprotocol === void 0) {
                this.#setClosed(new ProtoError(`Unrecognized WebSocket subprotocol: ${JSON.stringify(protocol)}`));
                return;
            }
        }
        for (const callbacks of this.#openCallbacks) {
            callbacks.openCallback();
        }
        this.#openCallbacks.length = 0;
        this.#opened = true;
    }
    #sendToSocket(msg) {
        const encoding = this.#subprotocol.encoding;
        if (encoding === "json") {
            const jsonMsg = writeJsonObject(msg, ClientMsg);
            this.#socket.send(jsonMsg);
        } else if (encoding === "protobuf") {
            const protobufMsg = writeProtobufMessage(msg, ClientMsg2);
            this.#socket.send(protobufMsg);
        } else {
            throw impossible(encoding, "Impossible encoding");
        }
    }
    /** Get the protocol version negotiated with the server, possibly waiting until the socket is open. */
    getVersion() {
        return new Promise((versionCallback, errorCallback) => {
            this.#getVersionCalled = true;
            if (this.#closed !== void 0) {
                errorCallback(this.#closed);
            } else if (!this.#opened) {
                const openCallback = () => versionCallback(this.#subprotocol.version);
                this.#openCallbacks.push({ openCallback, errorCallback });
            } else {
                versionCallback(this.#subprotocol.version);
            }
        });
    }
    // Make sure that the negotiated version is at least `minVersion`.
    /** @private */
    _ensureVersion(minVersion, feature) {
        if (this.#subprotocol === void 0 || !this.#getVersionCalled) {
            throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the WebSocket server is not yet known. Use Client.getVersion() to wait until the version is available.`);
        } else if (this.#subprotocol.version < minVersion) {
            throw new ProtocolVersionError(`${feature} is supported on protocol version ${minVersion} and higher, but the WebSocket server only supports version ${this.#subprotocol.version}`);
        }
    }
    // Send a request to the server and invoke a callback when we get the response.
    /** @private */
    _sendRequest(request, callbacks) {
        if (this.#closed !== void 0) {
            callbacks.errorCallback(new ClosedError("Client is closed", this.#closed));
            return;
        }
        const requestId = this.#requestIdAlloc.alloc();
        this.#responseMap.set(requestId, { ...callbacks, type: request.type });
        this.#send({ type: "request", requestId, request });
    }
    // The socket encountered an error.
    #onSocketError(event) {
        const eventMessage = event.message;
        const message = eventMessage ?? "WebSocket was closed due to an error";
        this.#setClosed(new WebSocketError(message));
    }
    // The socket was closed.
    #onSocketClose(event) {
        let message = `WebSocket was closed with code ${event.code}`;
        if (event.reason) {
            message += `: ${event.reason}`;
        }
        this.#setClosed(new WebSocketError(message));
    }
    // Close the client with the given error.
    #setClosed(error) {
        if (this.#closed !== void 0) {
            return;
        }
        this.#closed = error;
        for (const callbacks of this.#openCallbacks) {
            callbacks.errorCallback(error);
        }
        this.#openCallbacks.length = 0;
        for (const [requestId, responseState] of this.#responseMap.entries()) {
            responseState.errorCallback(error);
            this.#requestIdAlloc.free(requestId);
        }
        this.#responseMap.clear();
        this.#socket.close();
    }
    // We received a message from the socket.
    #onSocketMessage(event) {
        if (this.#closed !== void 0) {
            return;
        }
        try {
            let msg;
            const encoding = this.#subprotocol.encoding;
            if (encoding === "json") {
                if (typeof event.data !== "string") {
                    this.#socket.close(3003, "Only text messages are accepted with JSON encoding");
                    this.#setClosed(new ProtoError("Received non-text message from server with JSON encoding"));
                    return;
                }
                msg = readJsonObject(JSON.parse(event.data), ServerMsg);
            } else if (encoding === "protobuf") {
                if (!(event.data instanceof ArrayBuffer)) {
                    this.#socket.close(3003, "Only binary messages are accepted with Protobuf encoding");
                    this.#setClosed(new ProtoError("Received non-binary message from server with Protobuf encoding"));
                    return;
                }
                msg = readProtobufMessage(new Uint8Array(event.data), ServerMsg2);
            } else {
                throw impossible(encoding, "Impossible encoding");
            }
            this.#handleMsg(msg);
        } catch (e) {
            this.#socket.close(3007, "Could not handle message");
            this.#setClosed(e);
        }
    }
    // Handle a message from the server.
    #handleMsg(msg) {
        if (msg.type === "none") {
            throw new ProtoError("Received an unrecognized ServerMsg");
        } else if (msg.type === "hello_ok" || msg.type === "hello_error") {
            if (this.#recvdHello) {
                throw new ProtoError("Received a duplicated hello response");
            }
            this.#recvdHello = true;
            if (msg.type === "hello_error") {
                throw errorFromProto(msg.error);
            }
            return;
        } else if (!this.#recvdHello) {
            throw new ProtoError("Received a non-hello message before a hello response");
        }
        if (msg.type === "response_ok") {
            const requestId = msg.requestId;
            const responseState = this.#responseMap.get(requestId);
            this.#responseMap.delete(requestId);
            if (responseState === void 0) {
                throw new ProtoError("Received unexpected OK response");
            }
            this.#requestIdAlloc.free(requestId);
            try {
                if (responseState.type !== msg.response.type) {
                    console.dir({ responseState, msg });
                    throw new ProtoError("Received unexpected type of response");
                }
                responseState.responseCallback(msg.response);
            } catch (e) {
                responseState.errorCallback(e);
                throw e;
            }
        } else if (msg.type === "response_error") {
            const requestId = msg.requestId;
            const responseState = this.#responseMap.get(requestId);
            this.#responseMap.delete(requestId);
            if (responseState === void 0) {
                throw new ProtoError("Received unexpected error response");
            }
            this.#requestIdAlloc.free(requestId);
            responseState.errorCallback(errorFromProto(msg.error));
        } else {
            throw impossible(msg, "Impossible ServerMsg type");
        }
    }
    /** Open a {@link WsStream}, a stream for executing SQL statements. */
    openStream() {
        return WsStream.open(this);
    }
    /** Cache a SQL text on the server. This requires protocol version 2 or higher. */
    storeSql(sql) {
        this._ensureVersion(2, "storeSql()");
        const sqlId = this.#sqlIdAlloc.alloc();
        const sqlObj = new Sql(this, sqlId);
        const responseCallback = () => void 0;
        const errorCallback = (e) => sqlObj._setClosed(e);
        const request = { type: "store_sql", sqlId, sql };
        this._sendRequest(request, { responseCallback, errorCallback });
        return sqlObj;
    }
    /** @private */
    _closeSql(sqlId) {
        if (this.#closed !== void 0) {
            return;
        }
        const responseCallback = () => this.#sqlIdAlloc.free(sqlId);
        const errorCallback = (e) => this.#setClosed(e);
        const request = { type: "close_sql", sqlId };
        this._sendRequest(request, { responseCallback, errorCallback });
    }
    /** Close the client and the WebSocket. */
    close() {
        this.#setClosed(new ClientError("Client was manually closed"));
    }
    /** True if the client is closed. */
    get closed() {
        return this.#closed !== void 0;
    }
};

// node_modules/@libsql/isomorphic-fetch/web.js
var _fetch = fetch;
var _Request = Request;
var _Headers = Headers;

// node_modules/@libsql/hrana-client/lib-esm/queue_microtask.js
var _queueMicrotask;
if (typeof queueMicrotask !== "undefined") {
    _queueMicrotask = queueMicrotask;
} else {
    const resolved = Promise.resolve();
    _queueMicrotask = (callback) => {
        resolved.then(callback);
    };
}

// node_modules/@libsql/hrana-client/lib-esm/byte_queue.js
var ByteQueue = class {
    #array;
    #shiftPos;
    #pushPos;
    constructor(initialCap) {
        this.#array = new Uint8Array(new ArrayBuffer(initialCap));
        this.#shiftPos = 0;
        this.#pushPos = 0;
    }
    get length() {
        return this.#pushPos - this.#shiftPos;
    }
    data() {
        return this.#array.slice(this.#shiftPos, this.#pushPos);
    }
    push(chunk) {
        this.#ensurePush(chunk.byteLength);
        this.#array.set(chunk, this.#pushPos);
        this.#pushPos += chunk.byteLength;
    }
    #ensurePush(pushLength) {
        if (this.#pushPos + pushLength <= this.#array.byteLength) {
            return;
        }
        const filledLength = this.#pushPos - this.#shiftPos;
        if (filledLength + pushLength <= this.#array.byteLength && 2 * this.#pushPos >= this.#array.byteLength) {
            this.#array.copyWithin(0, this.#shiftPos, this.#pushPos);
        } else {
            let newCap = this.#array.byteLength;
            do {
                newCap *= 2;
            } while (filledLength + pushLength > newCap);
            const newArray = new Uint8Array(new ArrayBuffer(newCap));
            newArray.set(this.#array.slice(this.#shiftPos, this.#pushPos), 0);
            this.#array = newArray;
        }
        this.#pushPos = filledLength;
        this.#shiftPos = 0;
    }
    shift(length) {
        this.#shiftPos += length;
    }
};

// node_modules/@libsql/hrana-client/lib-esm/http/json_decode.js
function PipelineRespBody(obj) {
    const baton = stringOpt(obj["baton"]);
    const baseUrl = stringOpt(obj["base_url"]);
    const results = arrayObjectsMap(obj["results"], StreamResult);
    return { baton, baseUrl, results };
}
function StreamResult(obj) {
    const type = string(obj["type"]);
    if (type === "ok") {
        const response = StreamResponse(object(obj["response"]));
        return { type: "ok", response };
    } else if (type === "error") {
        const error = Error2(object(obj["error"]));
        return { type: "error", error };
    } else {
        throw new ProtoError("Unexpected type of StreamResult");
    }
}
function StreamResponse(obj) {
    const type = string(obj["type"]);
    if (type === "close") {
        return { type: "close" };
    } else if (type === "execute") {
        const result = StmtResult(object(obj["result"]));
        return { type: "execute", result };
    } else if (type === "batch") {
        const result = BatchResult(object(obj["result"]));
        return { type: "batch", result };
    } else if (type === "sequence") {
        return { type: "sequence" };
    } else if (type === "describe") {
        const result = DescribeResult(object(obj["result"]));
        return { type: "describe", result };
    } else if (type === "store_sql") {
        return { type: "store_sql" };
    } else if (type === "close_sql") {
        return { type: "close_sql" };
    } else if (type === "get_autocommit") {
        const isAutocommit = boolean(obj["is_autocommit"]);
        return { type: "get_autocommit", isAutocommit };
    } else {
        throw new ProtoError("Unexpected type of StreamResponse");
    }
}
function CursorRespBody(obj) {
    const baton = stringOpt(obj["baton"]);
    const baseUrl = stringOpt(obj["base_url"]);
    return { baton, baseUrl };
}

// node_modules/@libsql/hrana-client/lib-esm/http/protobuf_decode.js
var PipelineRespBody2 = {
    default() {
        return { baton: void 0, baseUrl: void 0, results: [] };
    },
    1(r, msg) {
        msg.baton = r.string();
    },
    2(r, msg) {
        msg.baseUrl = r.string();
    },
    3(r, msg) {
        msg.results.push(r.message(StreamResult2));
    }
};
var StreamResult2 = {
    default() {
        return { type: "none" };
    },
    1(r) {
        return { type: "ok", response: r.message(StreamResponse2) };
    },
    2(r) {
        return { type: "error", error: r.message(Error3) };
    }
};
var StreamResponse2 = {
    default() {
        return { type: "none" };
    },
    1(r) {
        return { type: "close" };
    },
    2(r) {
        return r.message(ExecuteStreamResp);
    },
    3(r) {
        return r.message(BatchStreamResp);
    },
    4(r) {
        return { type: "sequence" };
    },
    5(r) {
        return r.message(DescribeStreamResp);
    },
    6(r) {
        return { type: "store_sql" };
    },
    7(r) {
        return { type: "close_sql" };
    },
    8(r) {
        return r.message(GetAutocommitStreamResp);
    }
};
var ExecuteStreamResp = {
    default() {
        return { type: "execute", result: StmtResult2.default() };
    },
    1(r, msg) {
        msg.result = r.message(StmtResult2);
    }
};
var BatchStreamResp = {
    default() {
        return { type: "batch", result: BatchResult2.default() };
    },
    1(r, msg) {
        msg.result = r.message(BatchResult2);
    }
};
var DescribeStreamResp = {
    default() {
        return { type: "describe", result: DescribeResult2.default() };
    },
    1(r, msg) {
        msg.result = r.message(DescribeResult2);
    }
};
var GetAutocommitStreamResp = {
    default() {
        return { type: "get_autocommit", isAutocommit: false };
    },
    1(r, msg) {
        msg.isAutocommit = r.bool();
    }
};
var CursorRespBody2 = {
    default() {
        return { baton: void 0, baseUrl: void 0 };
    },
    1(r, msg) {
        msg.baton = r.string();
    },
    2(r, msg) {
        msg.baseUrl = r.string();
    }
};

// node_modules/@libsql/hrana-client/lib-esm/http/cursor.js
var HttpCursor = class extends Cursor {
    #stream;
    #encoding;
    #reader;
    #queue;
    #closed;
    #done;
    /** @private */
    constructor(stream, encoding) {
        super();
        this.#stream = stream;
        this.#encoding = encoding;
        this.#reader = void 0;
        this.#queue = new ByteQueue(16 * 1024);
        this.#closed = void 0;
        this.#done = false;
    }
    async open(response) {
        if (response.body === null) {
            throw new ProtoError("No response body for cursor request");
        }
        this.#reader = response.body.getReader();
        const respBody = await this.#nextItem(CursorRespBody, CursorRespBody2);
        if (respBody === void 0) {
            throw new ProtoError("Empty response to cursor request");
        }
        return respBody;
    }
    /** Fetch the next entry from the cursor. */
    next() {
        return this.#nextItem(CursorEntry, CursorEntry2);
    }
    /** Close the cursor. */
    close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
    }
    /** @private */
    _setClosed(error) {
        if (this.#closed !== void 0) {
            return;
        }
        this.#closed = error;
        this.#stream._cursorClosed(this);
        if (this.#reader !== void 0) {
            this.#reader.cancel();
        }
    }
    /** True if the cursor is closed. */
    get closed() {
        return this.#closed !== void 0;
    }
    async #nextItem(jsonFun, protobufDef) {
        for (; ;) {
            if (this.#done) {
                return void 0;
            } else if (this.#closed !== void 0) {
                throw new ClosedError("Cursor is closed", this.#closed);
            }
            if (this.#encoding === "json") {
                const jsonData = this.#parseItemJson();
                if (jsonData !== void 0) {
                    const jsonText = new TextDecoder().decode(jsonData);
                    const jsonValue = JSON.parse(jsonText);
                    return readJsonObject(jsonValue, jsonFun);
                }
            } else if (this.#encoding === "protobuf") {
                const protobufData = this.#parseItemProtobuf();
                if (protobufData !== void 0) {
                    return readProtobufMessage(protobufData, protobufDef);
                }
            } else {
                throw impossible(this.#encoding, "Impossible encoding");
            }
            if (this.#reader === void 0) {
                throw new InternalError("Attempted to read from HTTP cursor before it was opened");
            }
            const { value, done } = await this.#reader.read();
            if (done && this.#queue.length === 0) {
                this.#done = true;
            } else if (done) {
                throw new ProtoError("Unexpected end of cursor stream");
            } else {
                this.#queue.push(value);
            }
        }
    }
    #parseItemJson() {
        const data = this.#queue.data();
        const newlineByte = 10;
        const newlinePos = data.indexOf(newlineByte);
        if (newlinePos < 0) {
            return void 0;
        }
        const jsonData = data.slice(0, newlinePos);
        this.#queue.shift(newlinePos + 1);
        return jsonData;
    }
    #parseItemProtobuf() {
        const data = this.#queue.data();
        let varintValue = 0;
        let varintLength = 0;
        for (; ;) {
            if (varintLength >= data.byteLength) {
                return void 0;
            }
            const byte = data[varintLength];
            varintValue |= (byte & 127) << 7 * varintLength;
            varintLength += 1;
            if (!(byte & 128)) {
                break;
            }
        }
        if (data.byteLength < varintLength + varintValue) {
            return void 0;
        }
        const protobufData = data.slice(varintLength, varintLength + varintValue);
        this.#queue.shift(varintLength + varintValue);
        return protobufData;
    }
};

// node_modules/@libsql/hrana-client/lib-esm/http/json_encode.js
function PipelineReqBody(w, msg) {
    if (msg.baton !== void 0) {
        w.string("baton", msg.baton);
    }
    w.arrayObjects("requests", msg.requests, StreamRequest);
}
function StreamRequest(w, msg) {
    w.stringRaw("type", msg.type);
    if (msg.type === "close") {
    } else if (msg.type === "execute") {
        w.object("stmt", msg.stmt, Stmt2);
    } else if (msg.type === "batch") {
        w.object("batch", msg.batch, Batch2);
    } else if (msg.type === "sequence") {
        if (msg.sql !== void 0) {
            w.string("sql", msg.sql);
        }
        if (msg.sqlId !== void 0) {
            w.number("sql_id", msg.sqlId);
        }
    } else if (msg.type === "describe") {
        if (msg.sql !== void 0) {
            w.string("sql", msg.sql);
        }
        if (msg.sqlId !== void 0) {
            w.number("sql_id", msg.sqlId);
        }
    } else if (msg.type === "store_sql") {
        w.number("sql_id", msg.sqlId);
        w.string("sql", msg.sql);
    } else if (msg.type === "close_sql") {
        w.number("sql_id", msg.sqlId);
    } else if (msg.type === "get_autocommit") {
    } else {
        throw impossible(msg, "Impossible type of StreamRequest");
    }
}
function CursorReqBody(w, msg) {
    if (msg.baton !== void 0) {
        w.string("baton", msg.baton);
    }
    w.object("batch", msg.batch, Batch2);
}

// node_modules/@libsql/hrana-client/lib-esm/http/protobuf_encode.js
function PipelineReqBody2(w, msg) {
    if (msg.baton !== void 0) {
        w.string(1, msg.baton);
    }
    for (const req of msg.requests) {
        w.message(2, req, StreamRequest2);
    }
}
function StreamRequest2(w, msg) {
    if (msg.type === "close") {
        w.message(1, msg, CloseStreamReq2);
    } else if (msg.type === "execute") {
        w.message(2, msg, ExecuteStreamReq);
    } else if (msg.type === "batch") {
        w.message(3, msg, BatchStreamReq);
    } else if (msg.type === "sequence") {
        w.message(4, msg, SequenceStreamReq);
    } else if (msg.type === "describe") {
        w.message(5, msg, DescribeStreamReq);
    } else if (msg.type === "store_sql") {
        w.message(6, msg, StoreSqlStreamReq);
    } else if (msg.type === "close_sql") {
        w.message(7, msg, CloseSqlStreamReq);
    } else if (msg.type === "get_autocommit") {
        w.message(8, msg, GetAutocommitStreamReq);
    } else {
        throw impossible(msg, "Impossible type of StreamRequest");
    }
}
function CloseStreamReq2(_w, _msg) {
}
function ExecuteStreamReq(w, msg) {
    w.message(1, msg.stmt, Stmt3);
}
function BatchStreamReq(w, msg) {
    w.message(1, msg.batch, Batch3);
}
function SequenceStreamReq(w, msg) {
    if (msg.sql !== void 0) {
        w.string(1, msg.sql);
    }
    if (msg.sqlId !== void 0) {
        w.int32(2, msg.sqlId);
    }
}
function DescribeStreamReq(w, msg) {
    if (msg.sql !== void 0) {
        w.string(1, msg.sql);
    }
    if (msg.sqlId !== void 0) {
        w.int32(2, msg.sqlId);
    }
}
function StoreSqlStreamReq(w, msg) {
    w.int32(1, msg.sqlId);
    w.string(2, msg.sql);
}
function CloseSqlStreamReq(w, msg) {
    w.int32(1, msg.sqlId);
}
function GetAutocommitStreamReq(_w, _msg) {
}
function CursorReqBody2(w, msg) {
    if (msg.baton !== void 0) {
        w.string(1, msg.baton);
    }
    w.message(2, msg.batch, Batch3);
}

// node_modules/@libsql/hrana-client/lib-esm/http/stream.js
var HttpStream = class extends Stream {
    #client;
    #baseUrl;
    #jwt;
    #fetch;
    #baton;
    #queue;
    #flushing;
    #cursor;
    #closing;
    #closeQueued;
    #closed;
    #sqlIdAlloc;
    /** @private */
    constructor(client, baseUrl, jwt, customFetch) {
        super(client.intMode);
        this.#client = client;
        this.#baseUrl = baseUrl.toString();
        this.#jwt = jwt;
        this.#fetch = customFetch;
        this.#baton = void 0;
        this.#queue = new Queue();
        this.#flushing = false;
        this.#closing = false;
        this.#closeQueued = false;
        this.#closed = void 0;
        this.#sqlIdAlloc = new IdAlloc();
    }
    /** Get the {@link HttpClient} object that this stream belongs to. */
    client() {
        return this.#client;
    }
    /** @private */
    _sqlOwner() {
        return this;
    }
    /** Cache a SQL text on the server. */
    storeSql(sql) {
        const sqlId = this.#sqlIdAlloc.alloc();
        this.#sendStreamRequest({ type: "store_sql", sqlId, sql }).then(() => void 0, (error) => this._setClosed(error));
        return new Sql(this, sqlId);
    }
    /** @private */
    _closeSql(sqlId) {
        if (this.#closed !== void 0) {
            return;
        }
        this.#sendStreamRequest({ type: "close_sql", sqlId }).then(() => this.#sqlIdAlloc.free(sqlId), (error) => this._setClosed(error));
    }
    /** @private */
    _execute(stmt) {
        return this.#sendStreamRequest({ type: "execute", stmt }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _batch(batch) {
        return this.#sendStreamRequest({ type: "batch", batch }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _describe(protoSql) {
        return this.#sendStreamRequest({
            type: "describe",
            sql: protoSql.sql,
            sqlId: protoSql.sqlId
        }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _sequence(protoSql) {
        return this.#sendStreamRequest({
            type: "sequence",
            sql: protoSql.sql,
            sqlId: protoSql.sqlId
        }).then((_response) => {
            return void 0;
        });
    }
    /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
     * explicit transaction). This requires protocol version 3 or higher.
     */
    getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
            type: "get_autocommit"
        }).then((response) => {
            return response.isAutocommit;
        });
    }
    #sendStreamRequest(request) {
        return new Promise((responseCallback, errorCallback) => {
            this.#pushToQueue({ type: "pipeline", request, responseCallback, errorCallback });
        });
    }
    /** @private */
    _openCursor(batch) {
        return new Promise((cursorCallback, errorCallback) => {
            this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
    }
    /** @private */
    _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
            throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = void 0;
        _queueMicrotask(() => this.#flushQueue());
    }
    /** Immediately close the stream. */
    close() {
        this._setClosed(new ClientError("Stream was manually closed"));
    }
    /** Gracefully close the stream. */
    closeGracefully() {
        this.#closing = true;
        _queueMicrotask(() => this.#flushQueue());
    }
    /** True if the stream is closed. */
    get closed() {
        return this.#closed !== void 0 || this.#closing;
    }
    /** @private */
    _setClosed(error) {
        if (this.#closed !== void 0) {
            return;
        }
        this.#closed = error;
        if (this.#cursor !== void 0) {
            this.#cursor._setClosed(error);
        }
        this.#client._streamClosed(this);
        for (; ;) {
            const entry = this.#queue.shift();
            if (entry !== void 0) {
                entry.errorCallback(error);
            } else {
                break;
            }
        }
        if ((this.#baton !== void 0 || this.#flushing) && !this.#closeQueued) {
            this.#queue.push({
                type: "pipeline",
                request: { type: "close" },
                responseCallback: () => void 0,
                errorCallback: () => void 0
            });
            this.#closeQueued = true;
            _queueMicrotask(() => this.#flushQueue());
        }
    }
    #pushToQueue(entry) {
        if (this.#closed !== void 0) {
            throw new ClosedError("Stream is closed", this.#closed);
        } else if (this.#closing) {
            throw new ClosedError("Stream is closing", void 0);
        } else {
            this.#queue.push(entry);
            _queueMicrotask(() => this.#flushQueue());
        }
    }
    #flushQueue() {
        if (this.#flushing || this.#cursor !== void 0) {
            return;
        }
        if (this.#closing && this.#queue.length === 0) {
            this._setClosed(new ClientError("Stream was gracefully closed"));
            return;
        }
        const endpoint = this.#client._endpoint;
        if (endpoint === void 0) {
            this.#client._endpointPromise.then(() => this.#flushQueue(), (error) => this._setClosed(error));
            return;
        }
        const firstEntry = this.#queue.shift();
        if (firstEntry === void 0) {
            return;
        } else if (firstEntry.type === "pipeline") {
            const pipeline = [firstEntry];
            for (; ;) {
                const entry = this.#queue.first();
                if (entry !== void 0 && entry.type === "pipeline") {
                    pipeline.push(entry);
                    this.#queue.shift();
                } else if (entry === void 0 && this.#closing && !this.#closeQueued) {
                    pipeline.push({
                        type: "pipeline",
                        request: { type: "close" },
                        responseCallback: () => void 0,
                        errorCallback: () => void 0
                    });
                    this.#closeQueued = true;
                    break;
                } else {
                    break;
                }
            }
            this.#flushPipeline(endpoint, pipeline);
        } else if (firstEntry.type === "cursor") {
            this.#flushCursor(endpoint, firstEntry);
        } else {
            throw impossible(firstEntry, "Impossible type of QueueEntry");
        }
    }
    #flushPipeline(endpoint, pipeline) {
        this.#flush(() => this.#createPipelineRequest(pipeline, endpoint), (resp) => decodePipelineResponse(resp, endpoint.encoding), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (respBody) => handlePipelineResponse(pipeline, respBody), (error) => pipeline.forEach((entry) => entry.errorCallback(error)));
    }
    #flushCursor(endpoint, entry) {
        const cursor = new HttpCursor(this, endpoint.encoding);
        this.#cursor = cursor;
        this.#flush(() => this.#createCursorRequest(entry, endpoint), (resp) => cursor.open(resp), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (_respBody) => entry.cursorCallback(cursor), (error) => entry.errorCallback(error));
    }
    #flush(createRequest, decodeResponse, getBaton, getBaseUrl, handleResponse, handleError) {
        let promise;
        try {
            const request = createRequest();
            const fetch2 = this.#fetch;
            promise = fetch2(request);
        } catch (error) {
            promise = Promise.reject(error);
        }
        this.#flushing = true;
        promise.then((resp) => {
            if (!resp.ok) {
                return errorFromResponse(resp).then((error) => {
                    throw error;
                });
            }
            return decodeResponse(resp);
        }).then((r) => {
            this.#baton = getBaton(r);
            this.#baseUrl = getBaseUrl(r) ?? this.#baseUrl;
            handleResponse(r);
        }).catch((error) => {
            this._setClosed(error);
            handleError(error);
        }).finally(() => {
            this.#flushing = false;
            this.#flushQueue();
        });
    }
    #createPipelineRequest(pipeline, endpoint) {
        return this.#createRequest(new URL(endpoint.pipelinePath, this.#baseUrl), {
            baton: this.#baton,
            requests: pipeline.map((entry) => entry.request)
        }, endpoint.encoding, PipelineReqBody, PipelineReqBody2);
    }
    #createCursorRequest(entry, endpoint) {
        if (endpoint.cursorPath === void 0) {
            throw new ProtocolVersionError(`Cursors are supported only on protocol version 3 and higher, but the HTTP server only supports version ${endpoint.version}.`);
        }
        return this.#createRequest(new URL(endpoint.cursorPath, this.#baseUrl), {
            baton: this.#baton,
            batch: entry.batch
        }, endpoint.encoding, CursorReqBody, CursorReqBody2);
    }
    #createRequest(url, reqBody, encoding, jsonFun, protobufFun) {
        let bodyData;
        let contentType;
        if (encoding === "json") {
            bodyData = writeJsonObject(reqBody, jsonFun);
            contentType = "application/json";
        } else if (encoding === "protobuf") {
            bodyData = writeProtobufMessage(reqBody, protobufFun);
            contentType = "application/x-protobuf";
        } else {
            throw impossible(encoding, "Impossible encoding");
        }
        const headers = new _Headers();
        headers.set("content-type", contentType);
        if (this.#jwt !== void 0) {
            headers.set("authorization", `Bearer ${this.#jwt}`);
        }
        return new _Request(url.toString(), { method: "POST", headers, body: bodyData });
    }
};
function handlePipelineResponse(pipeline, respBody) {
    if (respBody.results.length !== pipeline.length) {
        throw new ProtoError("Server returned unexpected number of pipeline results");
    }
    for (let i = 0; i < pipeline.length; ++i) {
        const result = respBody.results[i];
        const entry = pipeline[i];
        if (result.type === "ok") {
            if (result.response.type !== entry.request.type) {
                throw new ProtoError("Received unexpected type of response");
            }
            entry.responseCallback(result.response);
        } else if (result.type === "error") {
            entry.errorCallback(errorFromProto(result.error));
        } else if (result.type === "none") {
            throw new ProtoError("Received unrecognized type of StreamResult");
        } else {
            throw impossible(result, "Received impossible type of StreamResult");
        }
    }
}
async function decodePipelineResponse(resp, encoding) {
    if (encoding === "json") {
        const respJson = await resp.json();
        return readJsonObject(respJson, PipelineRespBody);
    } else if (encoding === "protobuf") {
        const respData = await resp.arrayBuffer();
        return readProtobufMessage(new Uint8Array(respData), PipelineRespBody2);
    } else {
        throw impossible(encoding, "Impossible encoding");
    }
}
async function errorFromResponse(resp) {
    const respType = resp.headers.get("content-type") ?? "text/plain";
    if (respType === "application/json") {
        const respBody = await resp.json();
        if ("message" in respBody) {
            return errorFromProto(respBody);
        }
    }
    let message = `Server returned HTTP status ${resp.status}`;
    if (respType === "text/plain") {
        const respBody = (await resp.text()).trim();
        if (respBody !== "") {
            message += `: ${respBody}`;
        }
    }
    return new HttpServerError(message, resp.status);
}

// node_modules/@libsql/hrana-client/lib-esm/http/client.js
var checkEndpoints = [
    {
        versionPath: "v3-protobuf",
        pipelinePath: "v3-protobuf/pipeline",
        cursorPath: "v3-protobuf/cursor",
        version: 3,
        encoding: "protobuf"
    }
    /*
    {
        versionPath: "v3",
        pipelinePath: "v3/pipeline",
        cursorPath: "v3/cursor",
        version: 3,
        encoding: "json",
    },
    */
];
var fallbackEndpoint = {
    versionPath: "v2",
    pipelinePath: "v2/pipeline",
    cursorPath: void 0,
    version: 2,
    encoding: "json"
};
var HttpClient = class extends Client {
    #url;
    #jwt;
    #fetch;
    #closed;
    #streams;
    /** @private */
    _endpointPromise;
    /** @private */
    _endpoint;
    /** @private */
    constructor(url, jwt, customFetch, protocolVersion = 2) {
        super();
        this.#url = url;
        this.#jwt = jwt;
        this.#fetch = customFetch ?? _fetch;
        this.#closed = void 0;
        this.#streams = /* @__PURE__ */ new Set();
        if (protocolVersion == 3) {
            this._endpointPromise = findEndpoint(this.#fetch, this.#url);
            this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
        } else {
            this._endpointPromise = Promise.resolve(fallbackEndpoint);
            this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
        }
    }
    /** Get the protocol version supported by the server. */
    async getVersion() {
        if (this._endpoint !== void 0) {
            return this._endpoint.version;
        }
        return (await this._endpointPromise).version;
    }
    // Make sure that the negotiated version is at least `minVersion`.
    /** @private */
    _ensureVersion(minVersion, feature) {
        if (minVersion <= fallbackEndpoint.version) {
            return;
        } else if (this._endpoint === void 0) {
            throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the HTTP server is not yet known. Use Client.getVersion() to wait until the version is available.`);
        } else if (this._endpoint.version < minVersion) {
            throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the HTTP server only supports version ${this._endpoint.version}.`);
        }
    }
    /** Open a {@link HttpStream}, a stream for executing SQL statements. */
    openStream() {
        if (this.#closed !== void 0) {
            throw new ClosedError("Client is closed", this.#closed);
        }
        const stream = new HttpStream(this, this.#url, this.#jwt, this.#fetch);
        this.#streams.add(stream);
        return stream;
    }
    /** @private */
    _streamClosed(stream) {
        this.#streams.delete(stream);
    }
    /** Close the client and all its streams. */
    close() {
        this.#setClosed(new ClientError("Client was manually closed"));
    }
    /** True if the client is closed. */
    get closed() {
        return this.#closed !== void 0;
    }
    #setClosed(error) {
        if (this.#closed !== void 0) {
            return;
        }
        this.#closed = error;
        for (const stream of Array.from(this.#streams)) {
            stream._setClosed(new ClosedError("Client was closed", error));
        }
    }
};
async function findEndpoint(customFetch, clientUrl) {
    const fetch2 = customFetch;
    for (const endpoint of checkEndpoints) {
        const url = new URL(endpoint.versionPath, clientUrl);
        const request = new _Request(url.toString(), { method: "GET" });
        const response = await fetch2(request);
        await response.arrayBuffer();
        if (response.ok) {
            return endpoint;
        }
    }
    return fallbackEndpoint;
}

// node_modules/@libsql/hrana-client/lib-esm/index.js
function openWs(url, jwt, protocolVersion = 2) {
    if (typeof _WebSocket === "undefined") {
        throw new WebSocketUnsupportedError("WebSockets are not supported in this environment");
    }
    var subprotocols = void 0;
    if (protocolVersion == 3) {
        subprotocols = Array.from(subprotocolsV3.keys());
    } else {
        subprotocols = Array.from(subprotocolsV2.keys());
    }
    const socket = new _WebSocket(url, subprotocols);
    return new WsClient(socket, jwt);
}
function openHttp(url, jwt, customFetch, protocolVersion = 2) {
    return new HttpClient(url instanceof URL ? url : new URL(url), jwt, customFetch, protocolVersion);
}

// node_modules/@libsql/client/lib-esm/hrana.js
var HranaTransaction = class {
    #mode;
    #version;
    // Promise that is resolved when the BEGIN statement completes, or `undefined` if we haven't executed the
    // BEGIN statement yet.
    #started;
    /** @private */
    constructor(mode, version2) {
        this.#mode = mode;
        this.#version = version2;
        this.#started = void 0;
    }
    execute(stmt) {
        return this.batch([stmt]).then((results) => results[0]);
    }
    async batch(stmts) {
        const stream = this._getStream();
        if (stream.closed) {
            throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
            const hranaStmts = stmts.map(stmtToHrana);
            let rowsPromises;
            if (this.#started === void 0) {
                this._getSqlCache().apply(hranaStmts);
                const batch = stream.batch(this.#version >= 3);
                const beginStep = batch.step();
                const beginPromise = beginStep.run(transactionModeToBegin(this.#mode));
                let lastStep = beginStep;
                rowsPromises = hranaStmts.map((hranaStmt) => {
                    const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
                    if (this.#version >= 3) {
                        stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
                    }
                    const rowsPromise = stmtStep.query(hranaStmt);
                    rowsPromise.catch(() => void 0);
                    lastStep = stmtStep;
                    return rowsPromise;
                });
                this.#started = batch.execute().then(() => beginPromise).then(() => void 0);
                try {
                    await this.#started;
                } catch (e) {
                    this.close();
                    throw e;
                }
            } else {
                if (this.#version < 3) {
                    await this.#started;
                } else {
                }
                this._getSqlCache().apply(hranaStmts);
                const batch = stream.batch(this.#version >= 3);
                let lastStep = void 0;
                rowsPromises = hranaStmts.map((hranaStmt) => {
                    const stmtStep = batch.step();
                    if (lastStep !== void 0) {
                        stmtStep.condition(BatchCond.ok(lastStep));
                    }
                    if (this.#version >= 3) {
                        stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
                    }
                    const rowsPromise = stmtStep.query(hranaStmt);
                    rowsPromise.catch(() => void 0);
                    lastStep = stmtStep;
                    return rowsPromise;
                });
                await batch.execute();
            }
            const resultSets = [];
            for (const rowsPromise of rowsPromises) {
                const rows = await rowsPromise;
                if (rows === void 0) {
                    throw new LibsqlError("Statement in a transaction was not executed, probably because the transaction has been rolled back", "TRANSACTION_CLOSED");
                }
                resultSets.push(resultSetFromHrana(rows));
            }
            return resultSets;
        } catch (e) {
            throw mapHranaError(e);
        }
    }
    async executeMultiple(sql) {
        const stream = this._getStream();
        if (stream.closed) {
            throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
            if (this.#started === void 0) {
                this.#started = stream.run(transactionModeToBegin(this.#mode)).then(() => void 0);
                try {
                    await this.#started;
                } catch (e) {
                    this.close();
                    throw e;
                }
            } else {
                await this.#started;
            }
            await stream.sequence(sql);
        } catch (e) {
            throw mapHranaError(e);
        }
    }
    async rollback() {
        try {
            const stream = this._getStream();
            if (stream.closed) {
                return;
            }
            if (this.#started !== void 0) {
            } else {
                return;
            }
            const promise = stream.run("ROLLBACK").catch((e) => {
                throw mapHranaError(e);
            });
            stream.closeGracefully();
            await promise;
        } catch (e) {
            throw mapHranaError(e);
        } finally {
            this.close();
        }
    }
    async commit() {
        try {
            const stream = this._getStream();
            if (stream.closed) {
                throw new LibsqlError("Cannot commit the transaction because it is already closed", "TRANSACTION_CLOSED");
            }
            if (this.#started !== void 0) {
                await this.#started;
            } else {
                return;
            }
            const promise = stream.run("COMMIT").catch((e) => {
                throw mapHranaError(e);
            });
            stream.closeGracefully();
            await promise;
        } catch (e) {
            throw mapHranaError(e);
        } finally {
            this.close();
        }
    }
};
async function executeHranaBatch(mode, version2, batch, hranaStmts) {
    const beginStep = batch.step();
    const beginPromise = beginStep.run(transactionModeToBegin(mode));
    let lastStep = beginStep;
    const stmtPromises = hranaStmts.map((hranaStmt) => {
        const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
        if (version2 >= 3) {
            stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
        }
        const stmtPromise = stmtStep.query(hranaStmt);
        lastStep = stmtStep;
        return stmtPromise;
    });
    const commitStep = batch.step().condition(BatchCond.ok(lastStep));
    if (version2 >= 3) {
        commitStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
    }
    const commitPromise = commitStep.run("COMMIT");
    const rollbackStep = batch.step().condition(BatchCond.not(BatchCond.ok(commitStep)));
    rollbackStep.run("ROLLBACK").catch((_) => void 0);
    await batch.execute();
    const resultSets = [];
    await beginPromise;
    for (const stmtPromise of stmtPromises) {
        const hranaRows = await stmtPromise;
        if (hranaRows === void 0) {
            throw new LibsqlError("Statement in a batch was not executed, probably because the transaction has been rolled back", "TRANSACTION_CLOSED");
        }
        resultSets.push(resultSetFromHrana(hranaRows));
    }
    await commitPromise;
    return resultSets;
}
function stmtToHrana(stmt) {
    if (typeof stmt === "string") {
        return new Stmt(stmt);
    }
    const hranaStmt = new Stmt(stmt.sql);
    if (Array.isArray(stmt.args)) {
        hranaStmt.bindIndexes(stmt.args);
    } else {
        for (const [key, value] of Object.entries(stmt.args)) {
            hranaStmt.bindName(key, value);
        }
    }
    return hranaStmt;
}
function resultSetFromHrana(hranaRows) {
    const columns = hranaRows.columnNames.map((c) => c ?? "");
    const columnTypes = hranaRows.columnDecltypes.map((c) => c ?? "");
    const rows = hranaRows.rows;
    const rowsAffected = hranaRows.affectedRowCount;
    const lastInsertRowid = hranaRows.lastInsertRowid !== void 0 ? hranaRows.lastInsertRowid : void 0;
    return new ResultSetImpl(columns, columnTypes, rows, rowsAffected, lastInsertRowid);
}
function mapHranaError(e) {
    if (e instanceof ClientError) {
        const code = mapHranaErrorCode(e);
        return new LibsqlError(e.message, code, void 0, e);
    }
    return e;
}
function mapHranaErrorCode(e) {
    if (e instanceof ResponseError && e.code !== void 0) {
        return e.code;
    } else if (e instanceof ProtoError) {
        return "HRANA_PROTO_ERROR";
    } else if (e instanceof ClosedError) {
        return e.cause instanceof ClientError ? mapHranaErrorCode(e.cause) : "HRANA_CLOSED_ERROR";
    } else if (e instanceof WebSocketError) {
        return "HRANA_WEBSOCKET_ERROR";
    } else if (e instanceof HttpServerError) {
        return "SERVER_ERROR";
    } else if (e instanceof ProtocolVersionError) {
        return "PROTOCOL_VERSION_ERROR";
    } else if (e instanceof InternalError) {
        return "INTERNAL_ERROR";
    } else {
        return "UNKNOWN";
    }
}

// node_modules/@libsql/client/lib-esm/sql_cache.js
var SqlCache = class {
    #owner;
    #sqls;
    capacity;
    constructor(owner, capacity) {
        this.#owner = owner;
        this.#sqls = new Lru();
        this.capacity = capacity;
    }
    // Replaces SQL strings with cached `hrana.Sql` objects in the statements in `hranaStmts`. After this
    // function returns, we guarantee that all `hranaStmts` refer to valid (not closed) `hrana.Sql` objects,
    // but _we may invalidate any other `hrana.Sql` objects_ (by closing them, thus removing them from the
    // server).
    //
    // In practice, this means that after calling this function, you can use the statements only up to the
    // first `await`, because concurrent code may also use the cache and invalidate those statements.
    apply(hranaStmts) {
        if (this.capacity <= 0) {
            return;
        }
        const usedSqlObjs = /* @__PURE__ */ new Set();
        for (const hranaStmt of hranaStmts) {
            if (typeof hranaStmt.sql !== "string") {
                continue;
            }
            const sqlText = hranaStmt.sql;
            if (sqlText.length >= 5e3) {
                continue;
            }
            let sqlObj = this.#sqls.get(sqlText);
            if (sqlObj === void 0) {
                while (this.#sqls.size + 1 > this.capacity) {
                    const [evictSqlText, evictSqlObj] = this.#sqls.peekLru();
                    if (usedSqlObjs.has(evictSqlObj)) {
                        break;
                    }
                    evictSqlObj.close();
                    this.#sqls.delete(evictSqlText);
                }
                if (this.#sqls.size + 1 <= this.capacity) {
                    sqlObj = this.#owner.storeSql(sqlText);
                    this.#sqls.set(sqlText, sqlObj);
                }
            }
            if (sqlObj !== void 0) {
                hranaStmt.sql = sqlObj;
                usedSqlObjs.add(sqlObj);
            }
        }
    }
};
var Lru = class {
    // This maps keys to the cache values. The entries are ordered by their last use (entires that were used
    // most recently are at the end).
    #cache;
    constructor() {
        this.#cache = /* @__PURE__ */ new Map();
    }
    get(key) {
        const value = this.#cache.get(key);
        if (value !== void 0) {
            this.#cache.delete(key);
            this.#cache.set(key, value);
        }
        return value;
    }
    set(key, value) {
        this.#cache.set(key, value);
    }
    peekLru() {
        for (const entry of this.#cache.entries()) {
            return entry;
        }
        return void 0;
    }
    delete(key) {
        this.#cache.delete(key);
    }
    get size() {
        return this.#cache.size;
    }
};

// node_modules/@libsql/client/lib-esm/ws.js
var import_promise_limit = __toESM(require_promise_limit(), 1);
function _createClient(config) {
    if (config.scheme !== "wss" && config.scheme !== "ws") {
        throw new LibsqlError(`The WebSocket client supports only "libsql:", "wss:" and "ws:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
    }
    if (config.encryptionKey !== void 0) {
        throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
    }
    if (config.scheme === "ws" && config.tls) {
        throw new LibsqlError(`A "ws:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
    } else if (config.scheme === "wss" && !config.tls) {
        throw new LibsqlError(`A "wss:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
    }
    const url = encodeBaseUrl(config.scheme, config.authority, config.path);
    let client;
    try {
        client = openWs(url, config.authToken);
    } catch (e) {
        if (e instanceof WebSocketUnsupportedError) {
            const suggestedScheme = config.scheme === "wss" ? "https" : "http";
            const suggestedUrl = encodeBaseUrl(suggestedScheme, config.authority, config.path);
            throw new LibsqlError(`This environment does not support WebSockets, please switch to the HTTP client by using a "${suggestedScheme}:" URL (${JSON.stringify(suggestedUrl)}). For more information, please read ${supportedUrlLink}`, "WEBSOCKETS_NOT_SUPPORTED");
        }
        throw mapHranaError(e);
    }
    return new WsClient2(client, url, config.authToken, config.intMode, config.concurrency);
}
var maxConnAgeMillis = 60 * 1e3;
var sqlCacheCapacity = 100;
var WsClient2 = class {
    #url;
    #authToken;
    #intMode;
    // State of the current connection. The `hrana.WsClient` inside may be closed at any moment due to an
    // asynchronous error.
    #connState;
    // If defined, this is a connection that will be used in the future, once it is ready.
    #futureConnState;
    closed;
    protocol;
    #isSchemaDatabase;
    #promiseLimitFunction;
    /** @private */
    constructor(client, url, authToken, intMode, concurrency) {
        this.#url = url;
        this.#authToken = authToken;
        this.#intMode = intMode;
        this.#connState = this.#openConn(client);
        this.#futureConnState = void 0;
        this.closed = false;
        this.protocol = "ws";
        this.#promiseLimitFunction = (0, import_promise_limit.default)(concurrency);
    }
    async limit(fn) {
        return this.#promiseLimitFunction(fn);
    }
    async execute(stmtOrSql, args) {
        let stmt;
        if (typeof stmtOrSql === "string") {
            stmt = {
                sql: stmtOrSql,
                args: args || []
            };
        } else {
            stmt = stmtOrSql;
        }
        return this.limit(async () => {
            const streamState = await this.#openStream();
            try {
                const hranaStmt = stmtToHrana(stmt);
                streamState.conn.sqlCache.apply([hranaStmt]);
                const hranaRowsPromise = streamState.stream.query(hranaStmt);
                streamState.stream.closeGracefully();
                const hranaRowsResult = await hranaRowsPromise;
                return resultSetFromHrana(hranaRowsResult);
            } catch (e) {
                throw mapHranaError(e);
            } finally {
                this._closeStream(streamState);
            }
        });
    }
    async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
            const streamState = await this.#openStream();
            try {
                const hranaStmts = stmts.map(stmtToHrana);
                const version2 = await streamState.conn.client.getVersion();
                streamState.conn.sqlCache.apply(hranaStmts);
                const batch = streamState.stream.batch(version2 >= 3);
                const resultsPromise = executeHranaBatch(mode, version2, batch, hranaStmts);
                const results = await resultsPromise;
                return results;
            } catch (e) {
                throw mapHranaError(e);
            } finally {
                this._closeStream(streamState);
            }
        });
    }
    async transaction(mode = "write") {
        return this.limit(async () => {
            const streamState = await this.#openStream();
            try {
                const version2 = await streamState.conn.client.getVersion();
                return new WsTransaction(this, streamState, mode, version2);
            } catch (e) {
                this._closeStream(streamState);
                throw mapHranaError(e);
            }
        });
    }
    async executeMultiple(sql) {
        return this.limit(async () => {
            const streamState = await this.#openStream();
            try {
                const promise = streamState.stream.sequence(sql);
                streamState.stream.closeGracefully();
                await promise;
            } catch (e) {
                throw mapHranaError(e);
            } finally {
                this._closeStream(streamState);
            }
        });
    }
    sync() {
        throw new LibsqlError("sync not supported in ws mode", "SYNC_NOT_SUPPORTED");
    }
    async #openStream() {
        if (this.closed) {
            throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
        }
        const now = /* @__PURE__ */ new Date();
        const ageMillis = now.valueOf() - this.#connState.openTime.valueOf();
        if (ageMillis > maxConnAgeMillis && this.#futureConnState === void 0) {
            const futureConnState = this.#openConn();
            this.#futureConnState = futureConnState;
            futureConnState.client.getVersion().then((_version) => {
                if (this.#connState !== futureConnState) {
                    if (this.#connState.streamStates.size === 0) {
                        this.#connState.client.close();
                    } else {
                    }
                }
                this.#connState = futureConnState;
                this.#futureConnState = void 0;
            }, (_e) => {
                this.#futureConnState = void 0;
            });
        }
        if (this.#connState.client.closed) {
            try {
                if (this.#futureConnState !== void 0) {
                    this.#connState = this.#futureConnState;
                } else {
                    this.#connState = this.#openConn();
                }
            } catch (e) {
                throw mapHranaError(e);
            }
        }
        const connState = this.#connState;
        try {
            if (connState.useSqlCache === void 0) {
                connState.useSqlCache = await connState.client.getVersion() >= 2;
                if (connState.useSqlCache) {
                    connState.sqlCache.capacity = sqlCacheCapacity;
                }
            }
            const stream = connState.client.openStream();
            stream.intMode = this.#intMode;
            const streamState = { conn: connState, stream };
            connState.streamStates.add(streamState);
            return streamState;
        } catch (e) {
            throw mapHranaError(e);
        }
    }
    #openConn(client) {
        try {
            client ??= openWs(this.#url, this.#authToken);
            return {
                client,
                useSqlCache: void 0,
                sqlCache: new SqlCache(client, 0),
                openTime: /* @__PURE__ */ new Date(),
                streamStates: /* @__PURE__ */ new Set()
            };
        } catch (e) {
            throw mapHranaError(e);
        }
    }
    _closeStream(streamState) {
        streamState.stream.close();
        const connState = streamState.conn;
        connState.streamStates.delete(streamState);
        if (connState.streamStates.size === 0 && connState !== this.#connState) {
            connState.client.close();
        }
    }
    close() {
        this.#connState.client.close();
        this.closed = true;
    }
};
var WsTransaction = class extends HranaTransaction {
    #client;
    #streamState;
    /** @private */
    constructor(client, state, mode, version2) {
        super(mode, version2);
        this.#client = client;
        this.#streamState = state;
    }
    /** @private */
    _getStream() {
        return this.#streamState.stream;
    }
    /** @private */
    _getSqlCache() {
        return this.#streamState.conn.sqlCache;
    }
    close() {
        this.#client._closeStream(this.#streamState);
    }
    get closed() {
        return this.#streamState.stream.closed;
    }
};

// node_modules/@libsql/client/lib-esm/http.js
var import_promise_limit2 = __toESM(require_promise_limit(), 1);
function _createClient2(config) {
    if (config.scheme !== "https" && config.scheme !== "http") {
        throw new LibsqlError(`The HTTP client supports only "libsql:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
    }
    if (config.encryptionKey !== void 0) {
        throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
    }
    if (config.scheme === "http" && config.tls) {
        throw new LibsqlError(`A "http:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
    } else if (config.scheme === "https" && !config.tls) {
        throw new LibsqlError(`A "https:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
    }
    const url = encodeBaseUrl(config.scheme, config.authority, config.path);
    return new HttpClient2(url, config.authToken, config.intMode, config.fetch, config.concurrency);
}
var sqlCacheCapacity2 = 30;
var HttpClient2 = class {
    #client;
    protocol;
    #authToken;
    #promiseLimitFunction;
    /** @private */
    constructor(url, authToken, intMode, customFetch, concurrency) {
        this.#client = openHttp(url, authToken, customFetch);
        this.#client.intMode = intMode;
        this.protocol = "http";
        this.#authToken = authToken;
        this.#promiseLimitFunction = (0, import_promise_limit2.default)(concurrency);
    }
    async limit(fn) {
        return this.#promiseLimitFunction(fn);
    }
    async execute(stmtOrSql, args) {
        let stmt;
        if (typeof stmtOrSql === "string") {
            stmt = {
                sql: stmtOrSql,
                args: args || []
            };
        } else {
            stmt = stmtOrSql;
        }
        return this.limit(async () => {
            try {
                const hranaStmt = stmtToHrana(stmt);
                let rowsPromise;
                const stream = this.#client.openStream();
                try {
                    rowsPromise = stream.query(hranaStmt);
                } finally {
                    stream.closeGracefully();
                }
                const rowsResult = await rowsPromise;
                return resultSetFromHrana(rowsResult);
            } catch (e) {
                throw mapHranaError(e);
            }
        });
    }
    async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
            try {
                const hranaStmts = stmts.map(stmtToHrana);
                const version2 = await this.#client.getVersion();
                let resultsPromise;
                const stream = this.#client.openStream();
                try {
                    const sqlCache = new SqlCache(stream, sqlCacheCapacity2);
                    sqlCache.apply(hranaStmts);
                    const batch = stream.batch(false);
                    resultsPromise = executeHranaBatch(mode, version2, batch, hranaStmts);
                } finally {
                    stream.closeGracefully();
                }
                const results = await resultsPromise;
                return results;
            } catch (e) {
                throw mapHranaError(e);
            }
        });
    }
    async transaction(mode = "write") {
        return this.limit(async () => {
            try {
                const version2 = await this.#client.getVersion();
                return new HttpTransaction(this.#client.openStream(), mode, version2);
            } catch (e) {
                throw mapHranaError(e);
            }
        });
    }
    async executeMultiple(sql) {
        return this.limit(async () => {
            try {
                let promise;
                const stream = this.#client.openStream();
                try {
                    promise = stream.sequence(sql);
                } finally {
                    stream.closeGracefully();
                }
                await promise;
            } catch (e) {
                throw mapHranaError(e);
            }
        });
    }
    sync() {
        throw new LibsqlError("sync not supported in http mode", "SYNC_NOT_SUPPORTED");
    }
    close() {
        this.#client.close();
    }
    get closed() {
        return this.#client.closed;
    }
};
var HttpTransaction = class extends HranaTransaction {
    #stream;
    #sqlCache;
    /** @private */
    constructor(stream, mode, version2) {
        super(mode, version2);
        this.#stream = stream;
        this.#sqlCache = new SqlCache(stream, sqlCacheCapacity2);
    }
    /** @private */
    _getStream() {
        return this.#stream;
    }
    /** @private */
    _getSqlCache() {
        return this.#sqlCache;
    }
    close() {
        this.#stream.close();
    }
    get closed() {
        return this.#stream.closed;
    }
};

// node_modules/@libsql/client/lib-esm/web.js
function createClient(config) {
    return _createClient3(expandConfig(config, true));
}
function _createClient3(config) {
    if (config.scheme === "ws" || config.scheme === "wss") {
        return _createClient(config);
    } else if (config.scheme === "http" || config.scheme === "https") {
        return _createClient2(config);
    } else {
        throw new LibsqlError(`The client that uses Web standard APIs supports only "libsql:", "wss:", "ws:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
    }
}

// src/index.ts
var src_default = {
    // 处理HTTP请求，展示日志表格
    async fetch(request, env) {
        const client = buildLibsqlClient(env);
        try {
            const logs = await fetchLogs(client);
            const html = generateHTML(logs);
            return new Response(html, {
                headers: {
                    "content-type": "text/html; charset=UTF-8"
                }
            });
        } catch (error) {
            console.error("\u83B7\u53D6\u65E5\u5FD7\u5931\u8D25:", error);
            return new Response("\u5185\u90E8\u670D\u52A1\u5668\u9519\u8BEF", { status: 500 });
        }
    }
};
function buildLibsqlClient(env) {
    const url = env.TURSO_URL?.trim();
    if (!url) {
        throw new Error("TURSO_URL\u73AF\u5883\u53D8\u91CF\u672A\u5B9A\u4E49");
    }
    const authToken = env.TURSO_AUTH_TOKEN?.trim();
    if (!authToken) {
        throw new Error("TURSO_AUTH_TOKEN\u73AF\u5883\u53D8\u91CF\u672A\u5B9A\u4E49");
    }
    return createClient({ url, authToken });
}
async function fetchLogs(client) {
    try {
        const result = await client.execute("SELECT timestamp, datetime, message FROM logs ORDER BY id DESC");
        const logs = result.rows.map((row) => {
            const utcTimestamp = row[0];
            const utcDatetime = row[1];
            const timestamp = convertToBeijingTime(utcTimestamp);
            const datetime = convertToBeijingTime(utcDatetime);
            return {
                timestamp,
                datetime,
                message: row[2]
            };
        });
        return logs;
    } catch (error) {
        console.error("\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25:", error);
        throw new Error("\u4ECE\u6570\u636E\u5E93\u83B7\u53D6\u65E5\u5FD7\u5931\u8D25");
    }
}
function convertToBeijingTime(utcTime) {
    const date = new Date(utcTime);
    return date.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false });
}
function generateHTML(logs) {
    const rows = logs.map((log) => `
        <tr>
            <td>${log.timestamp}</td>
            <td>${log.datetime}</td>
            <td>${log.message}</td>
        </tr>`).join("");
    return `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>\u65E5\u5FD7\u8BB0\u5F55</title>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
            </style>
        </head>
        <body>
            <h1>\u65E5\u5FD7\u8BB0\u5F55</h1>
            <table>
                <thead>
                    <tr>
                        <th>\u65F6\u95F4\u6233</th>
                        <th>\u65E5\u671F\u65F6\u95F4</th>
                        <th>\u4FE1\u606F</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </body>
        </html>`;
}
export {
    src_default as default
};
//# sourceMappingURL=index.js.map


import * as Typings from 'https:cdn.jsdelivr.net/npm/typings.js';
// StackOverflow: https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript#answer-59187415
function utf8ArrayToString(aBytes) {
    var sView = "";
    
    for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
        nPart = aBytes[nIdx];
        
        sView += String.fromCharCode(
            nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
                /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
                (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
            : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
                (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
            : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
                (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
            : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
                (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
            : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
                (nPart - 192 << 6) + aBytes[++nIdx] - 128
            : /* nPart < 127 ? */ /* one byte */
                nPart
        );
    }
    
    return sView;
}
// My own code
const PtrUtils = mem => ({
  stringFromPtr(ptr) {
    let str = '';
    let u8arr = new Uint8Array(mem.buffer, ptr, this.strlen(ptr) - 1);
    let ch = () => u8arr[i];
    let i = 0;
    do {
      str += String.fromCharCode(ch());
      i++
    } while(ch != undefined);
    return str;
  },
  strlen(ptr, dataType = "Uint8") {
    let dataview = new DataView(mem.buffer, ptr);
    let i = 0;
    let ch = () => dataview['get' + dataType](i);
    for(;ch()!=0;i++) {}
    i++; // Include null terminator
    return i;
  }
});
export const
  /**
   * @namespace
   * @name JSWindows
   */
  JSWindows = {},
  /**
   * @namespace
   * @name WASMWindows
   */
  WASMWindows = {};

// JSWindows //
/**
 * Something that can be closed.
 * @interface JSWindows#CloseableWindow
 */
/**
 * Close the thing.
 * @function
 * @name JSWindows#CloseableWindow#close
 * @returns {void}
 */
/**
 * Whether it is closed
 * @property {boolean} closed
 * @name JSWindows#CloseableWindow#closed
 * @type {boolean}
 * @readonly
 */
/**
 * Something that can be used to open a window.
 * @interface
 * @name JSWindows#WindowInstantiator
 */
JSWindows.WindowInstantiator = Object.freeze(class {
  /**
   * Open a window.
   * @function
   * @name JSWindows#WindowInstantiator#open
   * @returns {CloseableWindow} The newly created window
   * @param {Document} content The HTML content of the window as an HTML/XML Document object
   */
  open(content) {
    throw new Error("Not implemented in interface");
  }
  /**
   * @private
   * @type {string}
   */
  static get __is() {
    return "WindowInstantiator"
  }
}),
/**
 * A [WindowInstantiator]{@link JSWindows#WindowInstantiator} that uses window.open().
 * @class
 * @name JSWindows#WindowOpenInstantiator
 * @implements {WindowInstantiator}
 */
JSWindows.WindowOpenInstantiator = Object.freeze(class extends JSWindows.WindowInstantiator {
  open(content) {
    /**@type {Blob} */
    const blob = new Blob(['<!doctype html><html>', content.documentElement.innerHTML, '</html>'], {type: "text/html"});
    const url = URL.createObjectURL(blob);
    return window.open(url, "_blank", "resizable, menubar=no, location=no, toolbar=no, status=no");
  }
}),
/**
 * A window that you can open.
 * Note (important): This uses [Typings.js]{@link https://npmjs.com/package/typings.js}, so you MUST pass the type parameters at runtime. The syntax is:
 * <code>new (JSWindows.Window(TInst))(title, initBody)</code>
 * @class
 * @template TInst The type of WindowInstantiator to use.
 * @name JSWindows#Window(TInst)
 * @param {WindowInstantiator} TInst The type of WindowInstantiator to use (a type that implements WindowInstantiator)
 * @property {string} title
 * @property {string} body
 * @property {Document} document The HTML document in the window.
 * @param {string} title The title of the window.
 * @param {string} initBody The initial content of the window.
 */
JSWindows.Window = Typings.createGenericClass(['TInst'], (tArgs) => class {
  constructor(title, initBody = '') {
    if (!('__is' in tArgs.TInst && tArgs.TInst.__is == "WindowInstantiator")) {
      delete this; // Self-Destruct
      throw new TypeError('TInst must implement WindowInstantiator');
    }
    // All's well
    this._title = title;
    this.document = document.implementation.createHTMLDocument(title);
    this.document.body.innerHTML = initBody;
  }
  get title() {
    return this._title;
  }
  set title(newVal) {
    this._title = newVal;
    this.document.title = newVal;
  }
  get body() {
    return this.document.body.innerHTML;
  }
  set body(newHTML) {
    this.document.body.innerHTML = newHTML;
  }
  /**
   * Open the window.
   * @function
   * @name JSWindows#Window(TInst)#open
   */
  open() {
    let inst = new tArgs.TInst();
    /**
     * @type {CloseableWindow}
     */
    this._ref = inst.open(this.document);
  }
  /**
   * Close the window.
   * @function
   * @name JSWindows#Window(TInst)#close
   */
  close() {
    ('_ref' in this && !this._ref.closed)? this._ref.close() : null;
  }
});
/**
   * A version of Window used to just view files.
   * Note: You need to call {@link JSWindows#Window#FileViewer(TInst)#load} to actually load a resource
   * @class
   * @name JSWindows#Window#FileViewer(TInst)
   * @extends {Window(TInst)}
   * @param {string} title The title of the window.
   */
JSWindows.Window.FileViewer = Typings.createGenericClass(["TInst"], (tArgs) => class extends JSWindows.Window(tArgs.TInst) {
    constructor(title) {
      super(title, `
<pre>Loading...</pre>
      `);
    }

    /**
     * Loads a resource asynchronously into the window.
     * @function
     * @name JSWindows#Window#FileViewer(TInst)#load
     * @returns {Promise<void>}
     * @param {string} url The URL of the resource to show
     */
    async load(url) {
      this.body = `
<pre>${await (await fetch(url)).text()}</pre>
      `;
    }
  });
Object.freeze(JSWindows.Window);
Object.freeze(JSWindows);

// WASMWindows //
/**
 * A plugin that sends windowing functionality to WASM/C
 * Usage: <code>await WebAssembly.instantiate(bytes, new (WASMWindows.WASMWindowingPlugin(TypeOfWindowInstantiator))(wasmOptions, memory))</code>
 * @class
 * @name WASMWindows#WASMWindowingPlugin(TInst)
 * @param {WindowInstantiator} TInst the type of WindowInstantiator to use (a type that implements WindowInstantiator)
 * @param {Object} webAssemblyOptions the options to pass through to WebAssembly
 * @param {Uint8Array | WebAssembly.Memory} WASMMemory The memory of the current WASM instance (for string-getting)
 */
WASMWindows.WASMWindowingPlugin = Typings.createGenericClass(['TInst'], tArgs => (obj = {env: {}}, WASMMemory = obj.env.memory) => () => {
  let resImports = {
    /**
     * @returns {number}
     * @param {number} title
     * @param {number} body 
     */
    createWindow(title, body) {
      WASMWindows.WASMWindowingPlugin.windowList.has([WASMMemory, tArgs.TInst])? WASMWindows.WASMWindowingPlugin.windowList.get([WASMMemory, tArgs.TInst]).push(new JSWindows.Window(PtrUtils(WASMMemory).stringFromPtr(title), PtrUtils(WASMMemory).stringFromPtr(body))) : WASMWindows.WASMWindowingPlugin.windowList.set([WASMMemory, tArgs.TInst], [new JSWindows.Window(PtrUtils.stringFromPtr(title), PtrUtils.stringFromPtr(body))]);
      return WASMWindows.WASMWindowingPlugin.windowList.get([WASMMemory, tArgs.TInst]).length - 1; // Index of most recently created window
    },
    openWindow(id) {
      WASMWindows.WASMWindowingPlugin.windowList.get([WASMMemory, tArgs.TInst])[id].open();
    },
    closeWindow(id) {
      WASMWindows.WASMWindowingPlugin.windowList.get([WASMMemory, tArgs.TInst])[id].close();
    }
  };
  let newOpts = {};
  Object.assign(newOpts, obj);
  Object.assign(newOpts.env || (newOpts.env = {}), resImports);
  return newOpts;
});
/**
 * @type {Map<Array<any>, Array<JSWindows.Window>>}
 * @private
 */
WASMWindows.WASMWindowingPlugin.windowList = new Map();
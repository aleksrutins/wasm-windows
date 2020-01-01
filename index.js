
import * as Typings from 'https:cdn.jsdelivr.net/npm/typings.js';
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
 * @class
 * @private
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
   * @name JSWindows#Window#open
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
   * @name JSWindows#Window#close
   */
  close() {
    ('_ref' in this && !this._ref.closed)? this._ref.close() : null;
  }
});
/**
   * A version of Window used to just view files.
   * Note: the constructor is an asynchronous function (uses the Fetch API), so you need to use <code>await new (JSWindows.Window(...).FileViewer)(...)</code>
   * @class
   * @name JSWindows#Window#FileViewer(TInst)
   * @extends {Window}
   * @param {string} title The title of the window.
   * @param {string} url The URL of the resource to view.
   */
JSWindows.Window.FileViewer = Typings.createGenericClass(["TInst"], (tArgs) => class extends JSWindows.Window(tArgs.TInst) {
    constructor(title) {
      super(title, `
<pre>Loading...</pre>
      `);
    }
    async load(url) {
      this.body = `
<pre>${await (await fetch(url)).text()}</pre>
      `;
    }
  });
Object.freeze(JSWindows.Window);
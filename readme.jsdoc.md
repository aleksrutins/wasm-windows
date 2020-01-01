<script>
console.log("Welcome to the WASMWindows documentation!");
</script>
# wasm-windows
## A windowing library for JavaScript and WASM.
## **Quickstart**
First, create a normal HTML file:

```html
<!doctype html>

<html>
  <head>
    <title>WASMWindows Quickstart</title>
  </head>
  <body>
    <script type="module">
      // Our code will go here
    </script>
  </body>
</html>
```

Notice that there are no `<script src="...">` elements or anything. This is because WASMWindows uses ES6 imports.
Next, in the module script element, put the following to import the JavaScript version of WASMWindows (the WASM version is not implemented yet):
```js
import {JSWindows} from 'https:cdn.jsdelivr.net/npm/wasm-windows';
```
This will import it from the JSDelivr CDN.
After that line, put the following to create your first window:
```js
let myWnd = new (JSWindows.Window(JSWindows.WindowOpenInstantiator))('Hello', '<h1>Welcome to WASMWindows!</h1>');
```
This line will need some explaining. JSWindows uses the [TypingsJS](https://npmjs.com/package/typings.js) library for generic classes, so the `JSWindows.Window(JSWindows.WindowOpenInstantiator)` part is actually quite simple.
If you look at the [docs for Window](JSWindows_Window.html), you will see that it takes a type parameter TInst. That is where the `JSWindows.WindowOpenInstantiator` is going. `JSWindows.WindowOpenInstantiator` is a [`WindowInstantiator`](JSWindows_WindowInstantiator.html) that uses `window.open` to open a window.
So, basically, what this line does is it creates a window that uses the WindowOpenInstantiator, with title 'Hello' and initial document.body `<h1>Welcome to WASMWindows!</h1>`.
### Showing the window
To show the window, simply use this code:
```js
myWnd.open();
```
To close the window when it is open:
```js
myWnd.close();
```

Let's put that into our code.

### Putting it all together

This code will create a window and a button that closes it. Don't worry about the use of global-id-properties. That is now an HTML5 standard, and I'm pretty sure that there will never be an API called closeWndBtn.
```html
<!doctype html>
<html>
  <head>
    <title>WASMWindows Tutorial</title>
  </head>
  <body>
    <button id="closeWndBtn">Close Window</button>
    <script>
      import {JSWindows} from 'https:cdn.jsdelivr.net/npm/wasm-windows';
      let myWnd = new (JSWindows.Window(JSWindows.WindowOpenInstantiator))('Hello', '<h1>Welcome to WASMWindows!</h1>');
      myWnd.open();
      closeWndBtn.addEventListener('click', () => {
        myWnd.close();
      });
    </script>
  </body>
</html>
```
### Next steps

You can look at the [HTML file that I use for testing](test.include-in-jsdoc.html), which uses a [FileViewer](JSWindows_Window_FileViewer.html) as well.
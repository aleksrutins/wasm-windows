#include <wasm-windows.h>
#include <emscripten/emscripten.h>

int main() {
    Window myWnd = createWindow("Hi", "<h1>Hello there</h1>");
    openWindow(myWnd);
}
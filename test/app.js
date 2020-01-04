import {WASMWindows, JSWindows} from '../index.js';
const memory = new WebAssembly.Memory({initial: 10});
function instStrNoMimeType(promres, impob) {
    return promres.then(res => res.arrayBuffer())
                    .then(buf => WebAssembly.instantiate(buf, impob));
}
instStrNoMimeType(fetch('main.wasm'), WASMWindows.WASMWindowingPlugin(JSWindows.WindowOpenInstantiator)({
    env: {
        memory
    }
}, memory)).then(inst => {
    inst.instance.exports.main();
});
const fs = require('fs');
const path = require('path');
const { assertInModule, extractModules, extractChunks } = require('./util');

function run() {
    validateTest1();
    validateTest2();
    console.log('SUCCESS');
}

function validateTest1() {
    console.log('[Validate] test1');

    const src = fs.readFileSync(path.resolve(__dirname, 'out/bundle1.js')).toString();
    const modules = extractModules(src);
    // 0: Haxe entry point
    // 1: test.json

    assertInModule(0, modules[0], "Test1 Haxe module", [
        '// Generated by Haxe ',
        'var Test1 = function',
        'Test1.main()',
        'var json = __webpack_require__(1)' // require('./test.json')
    ]);

    assertInModule(1, modules[1], "Included `test.json` module", [
        'module.exports = {\\"answer\\":42}'
    ]);
}

function validateTest2() {
    console.log('[Validate] test2');

    let src = fs.readFileSync(path.resolve(__dirname, 'out/bundle2.js')).toString();
    let modules = extractModules(src);
    // 1: Haxe entry point

    assertInModule(0, modules[0], "Test2 Haxe module", [
        '// Generated by Haxe ',
        'var Test2 = function',
        'Test2.main()',
        'var Test2Sub', // host
        'Test2Sub = $s.Test2Sub' // bridge
    ]);

    src = fs.readFileSync(path.resolve(__dirname, 'out/0.bundle2.js')).toString();
    modules = extractModules(src);
    // 1: Haxe split bundle

    assertInModule(1, modules[1], "Test2Sub Haxe module", [
        'var Test2Sub = function',
        '$s.Test2Sub = Test2Sub' // export
    ]);
}

run();

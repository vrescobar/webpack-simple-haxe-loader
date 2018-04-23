const fs = require('fs');
const path = require('path');
const { assertInModule, extractModules } = require('./util');

function run() {
    validateTest1();
    console.log('SUCCESS');
}

function validateTest1() {
    console.log('[Validate] test1');

    const src = fs.readFileSync(path.resolve(__dirname, 'www/bundle1.js')).toString();
    const modules = extractModules(src);
    // 0: Haxe entry point
    // 1: detect global
    // 2: test.json

    assertInModule(modules[0], "Test1 Haxe module", [
        '// Generated by Haxe ',
        'var Test1 = function',
        'Test1.main()',
        'var json = __webpack_require__(2)' // require('./test.json')
    ]);

    assertInModule(modules[2], "Included `test.json` module", [
        'module.exports = {\\"answer\\":42}'
    ]);
}

module.exports = { run };

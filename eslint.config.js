const js = require('@eslint/js');
module.exports = [js.configs.recommended, { files: ['**/*.{ts,tsx}'], rules: { 'no-unused-vars': 'off', 'no-undef': 'off' } }];

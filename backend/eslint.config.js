const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
    {
        
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            '.cache/**',
            '.strapi/**',
            'coverage/**',
            '*.config.js',
            '.tmp/**',
            'src/admin/vite.config.example.ts',
        ],
    },
    {
        
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                
                process: 'readonly',
                console: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                Buffer: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            
            'no-unused-vars': 'off', 
            'no-undef': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],

            
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-non-null-assertion': 'warn',
        },
    },
    {
        
        files: ['**/*.js'],
        languageOptions: {
            parserOptions: {
                project: null, 
            },
        },
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
        },
    },
];
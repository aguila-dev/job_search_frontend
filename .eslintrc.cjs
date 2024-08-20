const path = require('path')
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    jest: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [['@', path.resolve(__dirname, 'src')]],
        extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['./**/*.js', './**/*.cjs'],
    },
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  plugins: ['react-refresh', 'prettier', 'import'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    'import/order': [
      'error',
      {
        groups: [['builtin', 'external', 'internal']],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'prettier/prettier': ['error', { semi: false }],
    'no-unused-expressions': 'error',
    '@typescript-eslint/no-floating-promises': 'off',
  },
}

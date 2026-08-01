import globals from 'globals';
import sonarjs from 'eslint-plugin-sonarjs';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
  files: ['**/*.js'],
  plugins: {
    sonarjs,
    "@stylistic": stylistic,
    "@import": importPlugin,
  },
  "rules": {
      "@stylistic/comma-dangle": ["warn", {
        "arrays": "always",
      "functions": "never"
    }],
    "@stylistic/space-infix-ops": "warn",
    "@stylistic/object-curly-spacing": ["warn", "always"],
    "@stylistic/semi": "warn",
    "@stylistic/comma-spacing": "warn",
    "@import/named": "off",
    "@import/no-duplicates": "warn",
    "@import/newline-after-import": ["error", { "count": 1 }],
    "@import/prefer-default-export": "off",
    "@import/no-extraneous-dependencies": "off",

    "no-console": ["warn", {
      "allow": ["warn", "error", "info"]
    }],
    "no-debugger": "error",
    "no-implied-eval": "error",
    "no-return-await": "error",
    "no-throw-literal": "error",
    "array-bracket-newline": [
      "error",
      "consistent"
    ],
    "array-bracket-spacing": [
      "error",
      "never"
    ],
    "array-element-newline": [
      "error",
      "consistent"
    ],
    "arrow-parens": "error",
    "arrow-body-style": "warn",
    "brace-style": [
      "error",
      "1tbs",
      {
        "allowSingleLine": false
      },
    ],
    "computed-property-spacing": [
      "error",
      "never"
    ],
    "key-spacing": [
      "error", {
        "afterColon": true
      }
    ],
    "linebreak-style": ["error", "unix"],
    "lines-between-class-members": ["off"],
    "max-len": ["error", {
      "code": 120,
      "tabWidth": 2,
      "ignoreComments": true,
      "ignoreTrailingComments": true,
      "ignoreUrls": true,
      "ignoreRegExpLiterals": true,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true
    }],
    "multiline-ternary": [
      "error",
      "always-multiline"
    ],
    "newline-per-chained-call": [
      "error",
      { "ignoreChainWithDepth": 2 }
    ],
    "class-methods-use-this": "off",
    "global-require": "off",
    "max-classes-per-file": "warn",
    "no-nested-ternary": "error",
    "no-use-before-define": "off",
    "no-shadow": "off",
    "no-unused-vars": "off",
    "no-trailing-spaces": "error",
    "no-whitespace-before-property": "error",
    "no-tabs": "error",
    "jsx-quotes": ["error", "prefer-double"],
    "arrow-spacing": "error",
    "no-multiple-empty-lines": ["error", {
      "max": 1,
      "maxEOF": 0,
      "maxBOF": 0
    }],
    "no-multi-spaces": "error",
    "space-before-blocks": "off",
    "eqeqeq": "error",
    "no-else-return": "error",
    "no-undef-init": "error",
    "no-unneeded-ternary": "error",
    "object-curly-newline": [
      "error",
      {
        "ImportDeclaration": {
          "multiline": true
        },
        "ObjectExpression": {
          "multiline": true,
          "minProperties": 3,
          "consistent": true
        },
        "ObjectPattern": {
          "multiline": true,
        }
      }
    ],
    "object-property-newline": [
      "error",
      {
        "allowAllPropertiesOnSameLine": false,
        "allowMultiplePropertiesPerLine": false
      }
    ],
    "semi-spacing": "warn",
    "space-in-parens": "error",
    "template-curly-spacing": [
      "error",
      "never"
    ],
    "default-case": "error",
    "dot-notation": "error",
    "eol-last": ["error", "always"],
    "curly": ["error", "all"],
    "@stylistic/indent": ["error", 2],
    "@stylistic/type-annotation-spacing": "error",
    "@stylistic/space-before-blocks": "error",
    "@stylistic/member-delimiter-style": [
      "warn",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": false
        }
      }
    ],
    "@stylistic/lines-between-class-members": [
      "error",
      "always",
      { "exceptAfterSingleLine": true }
    ],
    "@stylistic/padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": "export"
      },
      {
        "blankLine": "always",
        "prev": "*",
        "next": "return"
      },
      {
        "blankLine": "always",
        "prev": ["interface", "type"],
        "next": "*"
      }
    ],

    "operator-linebreak": "off",
    "no-restricted-imports": [
      "warn",
      {
        "paths": [
          {
            "name": "@ff/ui-kit",
            "message": "Импортируй компоненты напрямую, например: @ff/ui-kit/lib/Button"
          },
          {
            "name": "@ff/layouting",
            "message": "Импортируй компоненты напрямую, например: @ff/layouting/Track"
          },
          {
            "name": "lodash",
            "message": "Импортируй утилиты напрямую, например: lodash/isEmpty"
          }
        ]
      }
    ],
  },
  ignores:['./eslint.config.js']
}]);

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import perfectionist from 'eslint-plugin-perfectionist';

export default defineConfig([
  {
    extends: ['js/recommended'],
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'prettier/prettier': 'error',
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      js,
      perfectionist,
      react: pluginReact,
      prettier: pluginPrettier,
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json', './tsconfig.node.json'],
      },
    },
  },
  tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      // 기본 설정 사용
      ...perfectionist.configs['recommended-line-length'].rules,

      // 클래스 정렬 설정
      'perfectionist/sort-classes': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
          groups: [
            'static-property',
            'private-property',
            'property',
            'constructor',
            'static-method',
            'private-method',
            'method',
          ],
        },
      ],

      // JSX 속성 정렬 설정
      'perfectionist/sort-jsx-props': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
          groups: ['id', 'callback', 'data', 'style', 'unknown'],
          customGroups: {
            id: ['id', '.*Id$', '.*Key$', 'key', 'type', 'as'],
            callback: ['on.*', 'handle.*'],
            data: ['data', 'value', 'defaultValue', 'required', 'pattern'],
            style: ['className', 'style', 'disabled', 'readOnly', 'visible', 'hidden'],
          },
        },
      ],

      // 객체 정렬 설정 (필드 구조에 최적화)
      'perfectionist/sort-objects': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
          groups: ['id', 'type', 'label', 'validation', 'options', 'other'],
          customGroups: {
            id: ['id', '_id', 'fieldId', 'recordId'],
            validation: ['required', 'maxLength', 'minLength', 'pattern', 'validator'],
            type: ['type', 'fieldType', 'valueType', 'inputType'],
            label: ['label', 'name', 'displayName', 'title'],
            options: ['options', 'items', 'selectOptions', 'choices'],
            other: ['.*'],
          },
        },
      ],

      // 인터페이스/타입 정렬 설정
      'perfectionist/sort-interfaces': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
          groups: ['id', 'type', 'metadata', 'data', 'ui', 'function', 'unknown'],
          customGroups: {
            id: ['id', '_id', 'fieldId', 'recordId', '.*Id$'],
            type: ['type', '.*Type$'],
            unknown: ['.*'],
            function: ['on.*', 'handle.*'],
            ui: ['visible', 'disabled', 'readOnly', 'style', 'className'],
            data: ['value', 'defaultValue', 'data', 'records', 'fields', 'options'],
            metadata: ['label', 'name', 'title', 'required', 'createdAt', 'updatedAt'],
          },
        },
      ],

      'perfectionist/sort-imports': [
        'error',
        {
          sortSideEffects: true,
          type: 'line-length',
          order: 'asc',
          newlinesBetween: 'always',
          internalPattern: ['^@/.*', '^@internal/.*'],
          groups: [
            'type',
            'builtin-type',
            'external-type',
            'internal-type',
            ['ui-type', 'validator-type', 'storage-type'],
            'parent-type',
            'sibling-type',
            'index-type',
            ['builtin', 'external'],
            'internal',
            'ui',
            'record-manager',
            'validator',
            'storage',
            ['parent', 'sibling', 'index'],
            'object',
            'style',
            'side-effect',
          ],
          customGroups: {
            type: {
              'validator-type': ['^@/types/validators/.*'],
              'storage-type': ['^@/types/storage/.*'],
              'ui-type': ['^@/components/ui/.*', '^@/types/ui/.*'],
              'record-manager-type': ['^@/types/records/.*', '^@/types/managers/.*'],
              react: ['^react$', '^react-.+', '^@react'],
            },
            value: {
              validator: ['^@/validators/.*', '^@/services/validation.*'],
              ui: ['^@/components/ui/.*', '^@/ui/.*'],
              react: ['^react$', '^react-.+', '^@react'],
              storage: ['^@/storage/.*', '^@/services/storage.*'],
              'record-manager': ['^@/managers/.*', '^@/records/.*', '^@/services/record.*'],
            },
          },
        },
      ],
    },
  },
]);

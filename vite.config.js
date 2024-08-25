import { defineConfig } from 'vite';
import { resolve } from 'path';
import inlineResources from './vite-plugin-inline.mjs';
import strip from '@rollup/plugin-strip';
import { createHtmlPlugin } from 'vite-plugin-html';
import { JSDOM } from 'jsdom';

export default defineConfig({
  build: {
    outDir: 'public/build',
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: () => 'everything.js',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    inlineResources(),
    strip({
      include: '**/*.js',
      functions: ['console.*', 'assert.*', 'debug', 'alert'],
      sourceMap: false,
    }),
    {
      name: 'preserve-blade-syntax',
      transform(code, id) {
        if (id.endsWith('main.js')) {
          let modifiedCode = code.replace(/@json\(\$data\)/g, '___BLADE_JSON_PLACEHOLDER___');

          modifiedCode = modifiedCode.replace(
            /const\s+data\s*=\s*{[\s\S]*?};/,
            'const data = ___BLADE_JSON_PLACEHOLDER___;'
          );

          return modifiedCode;
        }
      },
    },
    {
      name: 'restore-blade-syntax',
      generateBundle(options, bundle) {
        for (const fileName in bundle) {
          if (fileName.endsWith('.js')) {
            const chunk = bundle[fileName];
            chunk.code = chunk.code.replace(/___BLADE_JSON_PLACEHOLDER___/g, '"@json($data)"');
          }
        }
      },
    },
    createHtmlPlugin({
      minify: false,
      inject: {
        data: {
          injectScript: '',
          injectStyle: '',
        },
      },
    }),
    {
      name: 'modify-html',
      transformIndexHtml(html) {
        const dom = new JSDOM(html);
        const document = dom.window.document;

        document.querySelectorAll('img').forEach((img) => {
          img.setAttribute('src', "{{ $data['photo_path'] }}");
        });

        return document.documentElement.outerHTML;
      },
    },
    {
      name: 'remove-css-js-links',
      transformIndexHtml(html) {
        return html
          .replace(/<script\s+type="module"[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<link\s+rel="stylesheet"[^>]*>/gi, '');
      },
    },
  ],
});

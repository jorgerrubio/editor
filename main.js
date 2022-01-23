import './style.css';
import Split from 'split-grid';
import { encode, decode } from 'js-base64';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === 'json') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker();
		}
		return new editorWorker();
	}
};

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

Split({
    columnGutters: [{
        track: 1,
        element: $('.gutter-col-1'),
    }],
    rowGutters: [{
        track: 1,
        element: $('.gutter-row-1'),
    }]
});

const COMMON_EDITOR_OPTIONS = {
    automaticLayout: true,
    fontSize: 16,
    theme: 'vs-dark',
}

const { pathname } = window.location;
const [css, html, js] = pathname.slice(1).split('%7C');

const cssEditor = createEditor('css', css ? decode(css) : '');
const htmlEditor = createEditor('html', html ? decode(html) : '');
const jsEditor = createEditor('typescript', js ? decode(js) : '');
update();

cssEditor.onDidChangeModelContent(update);
htmlEditor.onDidChangeModelContent(update);
jsEditor.onDidChangeModelContent(update);

function createEditor(type, value) {
    return monaco.editor.create($(`#${type}`), {
        language: type,
        value,
        ...COMMON_EDITOR_OPTIONS
    });
}

function update() {
    const css = cssEditor.getValue();
    const html = htmlEditor.getValue();
    const js = jsEditor.getValue();

    const hashed = `${encode(css)}|${encode(html)}|${encode(js)}`;
    window.history.replaceState(null, null, hashed);

    const htmlView = viewPage({ html, css, js });
    $('iframe').setAttribute('srcdoc', htmlView);
}

function viewPage({ html, css, js }) {
    return `
        <!doctype html>
        <html lang="en">
            <head>
                <style type="text/css">${css}</style>
            </head>
            <body>${html}</body>
            <script type="text/javascript">${js}</script>
        </html>
    `;
}
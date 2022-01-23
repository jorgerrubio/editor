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


const $js = $('#js');
const $css = $('#css');
const $html = $('#html');

const theme = 'vs-dark';

const cssEditor = monaco.editor.create($css, {
    language: 'css',
    theme,
    value: '',
});
const htmlEditor = monaco.editor.create($html, {
    language: 'html',
    theme,
    value: '',
});
const jsEditor = monaco.editor.create($js, {
    language: 'typescript',
    theme,
    value: '',
});

/* $js.addEventListener('input', update);
$css.addEventListener('input', update);
$html.addEventListener('input', update); */
cssEditor.onDidChangeModelContent(update);
htmlEditor.onDidChangeModelContent(update);
jsEditor.onDidChangeModelContent(update);

function loadPage() {
    const { pathname } = window.location;
    const [css, html, js] = pathname.slice(1).split('%7C');

    /* $css.value = css ? decode(css) : '';
    $html.value = html ? decode(html) : '';
    $js.value = js ? decode(js) : ''; */
    cssEditor.setValue(css ? decode(css) : '');
    htmlEditor.setValue(html ? decode(html) : '');
    jsEditor.setValue(js ? decode(js) : '');

    update();
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

const viewPage = ({ html, css, js }) => {
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

loadPage();
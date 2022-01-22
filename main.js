import './style.css';
import Split from 'split-grid';
import { encode, decode } from 'js-base64';

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

$js.addEventListener('input', update);
$css.addEventListener('input', update);
$html.addEventListener('input', update);

function loadPage() {
    const { pathname } = window.location;
    const [css, html, js] = pathname.slice(1).split('%7C');

    $css.value = css ? decode(css) : '';
    $html.value = html ? decode(html) : '';
    $js.value = js ? decode(js) : '';

    update();
}

function update() {
    const css = $css.value;
    const html = $html.value;
    const js = $js.value;

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
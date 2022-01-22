import './style.css';
import Split from 'split-grid';
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

function update() {
    const css = $css.value;
    const html = $html.value;
    const js = $js.value;
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
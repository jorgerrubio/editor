import './style.css'

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

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
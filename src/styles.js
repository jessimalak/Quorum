const _body = document.getElementsByTagName('body')[0];
let theme = localStorage.getItem("theme");
let color_ = '#444';
if (theme !== null || theme !== undefined) {
    _body.classList.add(theme);
}
else {
    theme = 'menta-light';
}
if (theme.includes('light')) {
    bar.updateBackground(Color.fromHex('#ffffff00'));
}
else {
    bar.updateBackground(Color.fromHex('#00000000'));
}
let fondo = localStorage.getItem("fondo");
if (fondo == "theme") {
    _body.style.background = "var(--back-color)";
}
else {
    _body.style.background = fondo;
}
function UpdateTheme(color) {
    let actual = _body.classList.item(0);
    _body.classList.remove(actual);
    _body.classList.add(color);
    if (color.includes('light')) {
        bar.updateBackground(Color.fromHex('#ffffff00'));
    }
    else {
        bar.updateBackground(Color.fromHex('#00000000'));
    }
}
function UpdateBackground(fondo) {
    if (fondo == "theme") {
        _body.style.background = "var(--back-color)";
    }
    else {
        _body.style.background = fondo;
    }
}
//# sourceMappingURL=styles.js.map
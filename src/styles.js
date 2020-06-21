const _body = document.getElementsByTagName('body')[0];
let theme = localStorage.getItem("theme");
if (theme !== null) {
    _body.classList.add(theme);
}
function UpdateTheme(color) {
    let actual = _body.classList.item(0);
    _body.classList.remove(actual);
    _body.classList.add(color);
    localStorage.setItem('theme', color);
}
//# sourceMappingURL=styles.js.map
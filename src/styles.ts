const _body = document.getElementsByTagName('body')[0];

let theme = localStorage.getItem("theme");

if (theme !== null || theme !== undefined) {
    _body.classList.add(theme);
} else {
    theme = 'mental-light';
}

let fondo = localStorage.getItem("fondo");

let chat_screen = document.getElementById('chatMessages')

if (chat_screen !== null) {
    if (fondo == "theme") {
        chat_screen.style.background = "var(--back-Color)"
    } else {
        chat_screen.style.background = fondo
    }
}

function UpdateTheme(color: string) {
    let actual: string = _body.classList.item(0);
    _body.classList.remove(actual);
    _body.classList.add(color);
}

function UpdateBackground(fondo: string) {
    if (fondo == "theme") {
        chat_screen.style.background = "var(--back-Color)"
    } else {
        chat_screen.style.background = fondo
    }
}



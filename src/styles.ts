const _body = document.getElementsByTagName('body')[0];

let theme = localStorage.getItem("theme");

if(theme !== null || theme !== undefined){
    _body.classList.add(theme);
}else{
    theme = 'mental-light';
}



function UpdateTheme(color:string){
    let actual:string = _body.classList.item(0);
    _body.classList.remove(actual);
    _body.classList.add(color);
}



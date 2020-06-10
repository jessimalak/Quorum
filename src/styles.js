var _body = document.getElementsByTagName('body')[0];
function color() {
    if(_body.classList.contains('mentaDark')){
        _body.classList.remove('mentaDark')
        _body.classList.add('mentaLight');
    }else{
    _body.classList.add('mentaDark');
    _body.classList.remove('mentaLight');
}}


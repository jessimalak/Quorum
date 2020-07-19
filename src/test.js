const {ipcRenderer} = require('electron')
let div = document.getElementById('div')
div.addEventListener('input', ()=>{

})

function parse(){
    twemoji.parse(document.body);
}

ipcRenderer.send('showWindow', true)

document.addEventListener('keyup', (k)=>{
    if(k.keyCode == 13){
        let textA = encrypt(div.innerText, code, "A")
        let textB = encrypt(div.innerText, code, "B")
        let textR = encrypt(div.innerText, code, "R")
        document.getElementById('contents').innerHTML += '<p>'+textA+'</p><p>'+textB+'</p><p>'+textR+'</p>'
    }
})
// parse()
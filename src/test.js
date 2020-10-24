// const {ipcRenderer} = require('electron')
let div = document.getElementById('div')
let duv = document.getElementById('contents');
let dov = document.getElementById('contents2');

let listica = [
    {
    name: "cuatro",
    fecha: 9508316,
    tipo: "sala"
    },
    {
        name:"second",
        fecha: 9508126,
        tipo: "sala"
    },
    {
        name:"first",
        fecha: 9508106,
        tipo: "sala"
    },
    {
        name:"last",
        fecha: 9508626,
        tipo: "sala"
    },
    {
        name:"three",
        fecha: 9508128,
        tipo: "sala"
    }
]

listica.forEach(element=>{
    duv.innerHTML += '<p>'+element.name+'</p><p>'+element.fecha+'</p><p>'+element.tipo+'</p><hr>'
})

listica.sort((item1, item2)=>{
    if(item1.fecha > item2.fecha){
        return -1
    }else if(item1.fecha < item2.fecha){
        return 1
    }
}).forEach(element=>{
    dov.innerHTML += '<hr><p>'+element.name+'</p><p>'+element.fecha+'</p><p>'+element.tipo+'</p><hr>'
})


// div.addEventListener('input', ()=>{
//     // let value = div.html();
    
//     console.log("innerhtml "+div.innerHTML);
//     console.log("innerText "+div.innerText);
//     // console.log("html "+duv.html())
// })

// function parse(){
//     twemoji.parse(document.body);
// }

// document.addEventListener('keyup', (k)=>{
//     if(k.key == "k"){
//         parse()
//     }

//     if(k.keyCode == 13){
//         // let textA = encrypt(div.innerText, code, "A")
//         // let textB = encrypt(div.innerText, code, "B")
//         // let textR = encrypt(div.innerText, code, "R")
//         let duv = $('#div').find('img').replaceWith(function(e) { return this.alt; })
//         console.log(div.innerText)
//         document.getElementById('contents').innerHTML += '<p>'+div.innerText+'</p>'
//     }
// })
// parse()
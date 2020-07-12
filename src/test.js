
let div = document.getElementById('div')
div.addEventListener('input', ()=>{
    parse()
    console.log(div.innerText)
})

function parse(){
    twemoji.parse(document.body);
}

// parse()
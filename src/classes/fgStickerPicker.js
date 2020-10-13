/*

// Usage
FgEmojiPicker.init({
    trigger: 'button',
    position: ['bottom', 'right'],
    dir: 'directory/to/json', (without json name)
    emit(emoji) {
        console.log(emoji);
    }
});
*/

const FgStickerPicker = function(options) {
    
    this.options = options;

    if (!this.options) {
        return console.error('You must provide object as a first argument')
    }

    this.init = () => {

        this.selectors.trigger = this.options.hasOwnProperty('trigger') ? this.options.trigger : console.error('You must proved trigger element like this - \'EmojiPicker.init({trigger: "selector"})\' ');
        this.selectors.search = '.fg-emoji-picker-search input';
        this.selectors.emojiContainer = '.fg-emoji-picker-grid'
        this.emojiItems = undefined;
        this.variable.emit = this.options.emit || null;
        this.variable.position = this.options.position || null;
        this.variable.dir = this.options.dir || '';
        if (!this.selectors.trigger) return;

        this.bindEvents();
    }

    this.lib = (el = undefined) => {
        return {
            el: document.querySelectorAll(el),
            on(event, callback, classList = undefined) {
                if (!classList) {
                    this.el.forEach(item => {
                        item.addEventListener(event, callback.bind(item))
                    })
                } else {
                    this.el.forEach(item => {
                        item.addEventListener(event, (e) => {
                            if (e.target.closest(classList)) {
                                callback.call(e.target.closest(classList), e)
                            }
                        })
                    })
                }
            }
        }
    },

    this.variable = {
        position: null,
        dir: '',
    }

    this.selectors = {
        emit: null,
        trigger: null
    }

    this.bindEvents = () => {
        this.lib('body').on('click', this.functions.removeEmojiPicker.bind(this));
        this.lib('body').on('click', this.functions.emitEmoji.bind(this));
        this.lib('body').on('click', this.functions.openEmojiSelector.bind(this), this.selectors.trigger);
        this.lib('body').on('input', this.functions.search.bind(this), this.selectors.search);
    }

    this.functions = {

        // Search
        search(e) {
            const val = e.target.value;
            if (!Array.isArray(this.emojiItems)) {
                this.emojiItems = Array.from(e.target.closest('.fg-emoji-picker').querySelectorAll('.fg-emoji-picker-all-categories li'));
            }
            this.emojiItems.filter(emoji => {
                if (!emoji.getAttribute('data-name').match(val)) {
                    emoji.style.display = 'none'
                } else {
                    emoji.style.display = ''
                }
            })

            if (!val.length) this.emojiItems = undefined;
        },

        removeEmojiPicker(e) {
            const el = e.target;
            const picker = document.querySelector('.fg-emoji-picker');

            if (!el.closest('.fg-emoji-picker')) picker ? picker.remove() : false;
            this.emojiItems = undefined
        },


        emitEmoji(e) {

            const el = e.target;

            if (el.tagName.toLowerCase() == 'a' && el.className.includes('fg-emoji-picker-item')) {
                e.preventDefault();

                let emoji = {
                    emoji: el.getAttribute('href'),
                    code: el.getAttribute('data-code')
                }
                if (this.variable.emit) this.variable.emit(emoji, this.triggerer)

                // const picker = document.querySelector('.fg-emoji-picker');
                // picker.remove();
            }

        },


        // Open omoji picker
        openEmojiSelector(e) {

            let el = e.target.closest(this.selectors.trigger)
            if (el) {
                e.preventDefault();

                // Bounding rect
                // Trigger position and (trigger) sizes
                let el = e.target.closest(this.selectors.trigger)

                if (typeof this.variable.emit === 'function') this.triggerer = el

                // Emoji Picker Promise
                this.emojiPicker().then(emojiPicker => {

                    // Insert picker
                    document.body.insertAdjacentHTML('afterbegin', emojiPicker);

                    const emojiPickerMain = document.querySelector('.fg-emoji-picker');
                    const emojiFooter = emojiPickerMain.querySelector('.fg-emoji-picker-footer');
                    const emojiBody = emojiPickerMain.querySelector('.fg-emoji-picker-all-categories')
                    // twemoji.parse(emojiPickerMain)

                    let positions = {
                        buttonTop:              e.pageY,
                        buttonWidth:            el.offsetWidth,
                        buttonFromLeft:         el.getBoundingClientRect().left,
                        bodyHeight:             document.body.offsetHeight,
                        bodyWidth:              document.body.offsetWidth,
                        windowScrollPosition:   window.pageYOffset,
                        emojiHeight:            emojiPickerMain.offsetHeight,
                        emojiWidth:             emojiPickerMain.offsetWidth,
                    }

                    
                    // Element position object
                    let position = {
                        top: emojiPickerMain.style.top = positions.buttonTop - positions.emojiHeight - 30,
                        left: emojiPickerMain.style.left = positions.buttonFromLeft - positions.emojiWidth,
                        bottom: emojiPickerMain.style.top = positions.buttonTop,
                        right: emojiPickerMain.style.left = positions.buttonFromLeft + positions.buttonWidth
                    }


                    // Positioning emoji container top
                    if (this.variable.position) {
                        this.variable.position.forEach(elemPos => {

                            if (elemPos === 'right') {
                                emojiPickerMain.style.left = position[elemPos]+'px';
                            } else if (elemPos === 'bottom') {
                                emojiPickerMain.style.top = position[elemPos]+'px';
                            } else {
                                emojiPickerMain.style[elemPos] = position[elemPos]+'px';
                            }
                        })
                    }



                    // Add event listener on click
                    document.body.querySelector('.fg-emoji-picker').onclick =  function(e) {

                        e.preventDefault();

                        let scrollTo = (element, to, duration = 100) => {

                            if (duration <= 0) return;
                            var difference = to - element.scrollTop;
                            var perTick = difference / duration * 10;
                        
                            setTimeout(function() {
                                element.scrollTop = element.scrollTop + perTick;
                                if (element.scrollTop === to) return;
                                scrollTo(element, to, duration - 10);
                            }, 10);
                        }

                        const el = e.target;
                        const filterLlnk = el.closest('a');

                        document.querySelectorAll('.fg-emoji-picker-categories li').forEach(item => item.classList.remove('active'))

                        if (filterLlnk && filterLlnk.closest('li') && filterLlnk.closest('li').getAttribute('data-index')) {

                            let list = filterLlnk.closest('li')
                            list.classList.add('active');
                            let listIndex = list.getAttribute('data-index');
                            
                            scrollTo(emojiBody, emojiBody.querySelector(`#${listIndex}`).offsetTop);
                        }


                    }

                })
            }
        }
    },



    // Create emoji container / Builder engine
    this.emojiPicker = () => {

        let categoryIcons = {
            'emotes':  '<img src="../stickers/Emotes/emoji-01.png">',
            'kimiiazy':  '<img src="../stickers/Kimiiazy/kimi-10.png">',
            'caritas-uwu':   '<img src="../stickers/Caritas UwU/uwu-07.png">',
            'actividades':       '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M17 4V2H7V4H2V11C2 12.1 2.9 13 4 13H7.1C7.5 14.96 9.04 16.5 11 16.9V19.08C8 19.54 8 22 8 22H16C16 22 16 19.54 13 19.08V16.9C14.96 16.5 16.5 14.96 16.9 13H20C21.1 13 22 12.1 22 11V4H17M4 11V6H7V11L4 11M15 12C15 13.65 13.65 15 12 15S9 13.65 9 12V4H15V12M20 11L17 11V6H20L20 11Z" /></svg>',            
            'objetos':          '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>',
            'simbolos':          '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M11.89,10.34L10.55,11.04C10.41,10.74 10.24,10.53 10.03,10.41C9.82,10.29 9.62,10.23 9.45,10.23C8.55,10.23 8.11,10.82 8.11,12C8.11,12.54 8.22,12.97 8.45,13.29C8.67,13.61 9,13.77 9.45,13.77C10.03,13.77 10.44,13.5 10.68,12.91L11.91,13.54C11.65,14.03 11.29,14.41 10.82,14.69C10.36,14.97 9.85,15.11 9.29,15.11C8.39,15.11 7.67,14.84 7.12,14.29C6.58,13.74 6.3,13 6.3,12C6.3,11.05 6.58,10.3 7.13,9.74C7.69,9.18 8.39,8.9 9.23,8.9C10.47,8.89 11.36,9.38 11.89,10.34M17.66,10.34L16.34,11.04C16.2,10.74 16,10.53 15.81,10.41C15.6,10.29 15.4,10.23 15.21,10.23C14.32,10.23 13.87,10.82 13.87,12C13.87,12.54 14,12.97 14.21,13.29C14.44,13.61 14.77,13.77 15.21,13.77C15.8,13.77 16.21,13.5 16.45,12.91L17.7,13.54C17.42,14.03 17.05,14.41 16.59,14.69C16.12,14.97 15.62,15.11 15.07,15.11C14.17,15.11 13.44,14.84 12.9,14.29C12.36,13.74 12.09,13 12.09,12C12.09,11.05 12.37,10.3 12.92,9.74C13.47,9.18 14.17,8.9 15,8.9C16.26,8.89 17.14,9.38 17.66,10.34M12,3.5A8.5,8.5 0 0,1 20.5,12A8.5,8.5 0 0,1 12,20.5A8.5,8.5 0 0,1 3.5,12A8.5,8.5 0 0,1 12,3.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>',
            'banderas':            '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12.36,6L12.76,8H18V14H14.64L14.24,12H7V6H12.36M14,4H5V21H7V14H12.6L13,16H20V6H14.4" /></svg>',
            'search':           '<svg width="20" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve"> <g> <g> <path d="M508.874,478.708L360.142,329.976c28.21-34.827,45.191-79.103,45.191-127.309c0-111.75-90.917-202.667-202.667-202.667 S0,90.917,0,202.667s90.917,202.667,202.667,202.667c48.206,0,92.482-16.982,127.309-45.191l148.732,148.732 c4.167,4.165,10.919,4.165,15.086,0l15.081-15.082C513.04,489.627,513.04,482.873,508.874,478.708z M202.667,362.667 c-88.229,0-160-71.771-160-160s71.771-160,160-160s160,71.771,160,160S290.896,362.667,202.667,362.667z"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>',
        }


        let picker = `
        <div class="fg-emoji-picker">
            <div class="fg-emoji-picker-categories">%categories%
                <div class="fg-emoji-picker-search">
                    <input placeholder="Buscar sticker" />
                    ${categoryIcons.search}
                </div>
            </div>
            <div>%pickerContainer%</div>
        </div>`;

        let categories = '<ul>%categories%</ul>';
        let categoriesInner = ``;
        let outerUl = `
        <div class="fg-emoji-picker-all-categories">%outerUL%</div>
        `;
        let innerLists = ``;

        const fetchData = fetch(`classes/sticker-list.json`)
        .then(response => response.json())
        .then(object => {

            // Index count
            let index = 0;

            // Loop through emoji object
            for (const key in object) {
                if (object.hasOwnProperty(key)) {

                    // Index count
                    index += 1;

                    let keyToId = key.split(' ').join('-').split('&').join('').toLowerCase();

                    const categories = object[key];
                    categoriesInner += `<li class="${index === 1 ? 'active' : ''}" id="${keyToId}" data-index="${keyToId}"><a href="#${keyToId}">${categoryIcons[keyToId]}</a></li>`   

                    innerLists += `
                        <ul class="fg-emoji-picker-category ${index === 1 ? 'active' : ''}" id="${keyToId}" category-name="${key}">
                            <div class="fg-emoji-picker-container-title">${key}</div>
                            <div class="fg-emoji-picker-grid">`;

                    // Loop through emoji items
                    categories.forEach(item => {
                        innerLists += `<li data-name="${item.description.toLowerCase()}"><a class="fg-emoji-picker-item" title="${item.description}" data-name="${item.description.toLowerCase()}" draggable="false" href="#" onclick="SendMessage('sticker', '../stickers/${key}/${item.name}.png')"><img src="../stickers/${key}/${item.name}.png" alt="${item.name}"></a></li>`;
                    })

                    innerLists += `
                            </div>
                        </ul>`;
                }
            }


            let allSmiles = outerUl.replace('%outerUL%', innerLists)
            let cats = categories.replace('%categories%', categoriesInner);
            let pickerContainer = picker.replace('%pickerContainer%', allSmiles)
            let data = pickerContainer.replace('%categories%', cats);
            return data;
        })

        return fetchData;
    }

    this.init();
    
}
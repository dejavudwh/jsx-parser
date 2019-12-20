let Lexer = require('./lexer')
let log = require('./utils')

class JsxParser {
    constructor(string) {
        this.lexer = new Lexer(string)
        this.tokens = this.lexer.token
        this.tags = []
        this.jsx = {
            'type': '',
            'props': {
                'childrens': ''
            },
        }
        this.setup()
    }

    setup() {
        let self = this
        this.parseMap = {
            'startTag': this.parseStart.bind(self),
            'endTag': this.parseEnd.bind(self),
            'text': this.parseText.bind(self),
            'eof': this.parseEof.bind(self),
            'error': this.parseErr.bind(self),
        }
    }

    parse() {
        this.currentToken = this.lexer.lex()
        let type = this.currentToken[0]
        let tag = this.currentToken[1]
        let props = this.currentToken[2]
        log('current token ', this.currentToken)
        let func = this.parseMap[type]
        if (func != undefined) {
            func(tag, props)
        } else {
            this.parseMap['error']()
        }

        log('tags', this.tags)
    }

    parseStart(tag, props) {
        let len = this.tags.length
        let jsx = this.jsx
        if (len > 1) {
            for (let i = 0; i < len; i++) {
                jsx = this.jsx['props']['childrens']
            }
        }
        log('start ', jsx)
        this.tags.push(tag)
        this.parse()
    }
    
    parseEnd(tag) {
        if (tag == this.tags[this.tags.length - 1]) {
            this.tags.pop()
        }
        this.parse()
    }

    parseText(tag) {
        this.jsx['props']['test'] = tag
        this.parse()
    }

    parseEof() {
        return
    }

    parseErr() {
        throw `parse err! syntax err `
    }
}

let str = `<div name="{{ad}}"    class="fuck" id="1">
                    this is text
                    <span name="asd">
                        <p>fu ck</p>
                    </span>
                </div>`

new JsxParser(str).parse()


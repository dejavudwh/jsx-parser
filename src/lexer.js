let log = require('./utils')

let token = {
    startTag: 'startTag',
    endTag: 'endTag',
    text: 'text',
    eof: 'eof'
}

class Lexer {
    constructor(string) {
        this.token = token
        this.string = string
        this.pos = 0
    }

    advance() {
        let str = this.string[this.pos]
        this.pos++
        return str
    }

    lookAhead() {
        let str = this.string[this.pos]
        return str
    }

    lex() {
        let text = ''
        while (true) {
            let t = this.advance()
            let token = ''
            switch (t) {
                case '<':
                    if (this.lookAhead() === '/') {
                        token = this.handleEndTag()
                    } else {
                        token = this.handleStartTag()
                    }
                    break
                case '\n':
                    break
                case ' ':
                    if (text != '') {
                        text += t
                    } else {
                        break
                    }
                case undefined:
                    if (this.pos >= this.string.length) {
                        token = [this.token['eof'], 'eof']
                    }
                    break
                default:
                    text += t
                    token = this.handleTextTag(text)
                    break
            }
            this.string = this.string.slice(this.pos)
            this.pos = 0
            if (token != '') {
                return token
            }
        }
    }

    handleStartTag() {
        let idx = this.string.indexOf('>')
        if (idx == -1) {
            throw 'parse err! miss match '>''
        }
        let str = this.string.slice(this.pos, idx)
        let s = ''
        if (str.includes(' ')) {
            s = this.string.split(' ').filter((str) => {
                return str != ''
            })[0]
        } else {
            s = this.string.split('>')[0]
        }
        let type = s.slice(1)
        this.pos += type.length
        let props = this.handlePropTag()
        this.advance()
        return [token.startTag, type, props]
    }

    handleEndTag() {
        this.advance()
        let idx = this.string.indexOf('>')
        let type = this.string.slice(this.pos, idx)
        this.pos += type.length
        if (this.advance() != '>') {
            throw 'parse err! miss match '>''
        }
        return [token.endTag, type]
    }

    handlePropTag() {
        // this.advance()
        let idx = this.string.indexOf('>')
        if (idx == -1) {
            throw 'parse err! miss match '>''
        }
        let string = this.string.slice(this.pos, idx)
        let pm = []
        if (string != ' ')  {
            let props = string.split(' ')
            pm = props.filter((props) => {
                return props != ''
            }).map((prop) => {
                let kv = prop.split('=')
                let o = {}
                o[kv[0]] = kv[1]
                return o
            })
            this.pos += string.length
        }
        
        return pm
    }

    handleTextTag(text) {
        if (this.lookAhead() == '<') {
            return [this.token['text'], text.trim()]
        } else {
            return ''
        }
    }
}

function main() {
    let str = `<div name="{{ad}}"    class="fuck" id="1">
                    this is text
                    <span name="asd">
                        <p>fu ck</p>
                    </span>
                </div>`
    let lexer = new Lexer(str)
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
}

// main()

module.exports = Lexer
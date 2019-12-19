// <div name='mydiv'>
//     <span id='myspan'>
//         <p>text</p>
//     </span>
// </div>  
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
        // log('advance', str)
        return str
    }

    lookAhead() {
        let str = this.string[this.pos]
        // log('lookahead', str)
        return str
    }

    lex() {
        let text = ''
        while (true) {
            let t = this.advance()
            switch (t) {
                case '<':
                    if (this.lookAhead() === '/') {
                        return this.handleEndTag()
                    } else {
                        return this.handleStartTag()
                    }
                case '\n':
                    break
                case undefined:
                    return this.token['eof']
                default:
                    text += t
                    if (this.lookAhead() == '<') {
                        return [this.token['text'], text]
                    }
                    break
            }
            this.string = this.string.slice(this.pos)
            this.pos = 0
        }
    }

    handleStartTag() {
        let s = this.string.split(' ').filter((str) => {
            return str != ''
        })[0]
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
        log('end tag', this.string, this.pos, idx, type)
        this.pos += type.length
        if (this.advance() != '>') {
            throw 'parse err! miss match '>''
        }
        return [token.endTag, type]
    }

    handlePropTag() {
        this.advance()
        let idx = this.string.indexOf('>')
        if (idx == -1) {
            throw 'parse err! miss match '>''
        }
        let string = this.string.slice(this.pos, idx)
        let props = string.split(' ')
        let pm = props.filter((props) => {
            return props != ''
        }).map((prop) => {
            let kv = prop.split('=')
            let o = {}
            o[kv[0]] = kv[1]
            return o
        })
        log('po ', this.pos)
        this.pos += string.length
        log('poa ', this.pos)
        return pm
    }
}

function main() {
    let str = `<div name="{{ad}}"    class="fuck" id="1">
                    this is text
                    <span name="asd"></span>
                </div>`
    let lexer = new Lexer(str)
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
}

main()

module.exports = Lexer
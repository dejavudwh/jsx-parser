// <div name='mydiv'>
//     <span id='myspan'>
//         <p>text</p>
//     </span>
// </div>  
let log = require('./utils')

let token = {
    startTag: 'startTag',
    endTag: 'endTag',
    propMap: 'propMap',
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
        log('advance', str)
        return str
    }

    lookAhead() {
        let str = this.string[this.pos]
        log('lookahead', str)
        return str
    }

    lex() {
        let key = ''
        while (true) {
            let t = this.advance()
            switch (t) {
                case '<':
                    if (this.lookAhead() === '/') {
                        return this.handleEndTag()
                    } else {
                        return this.handleStartTag()
                    }
                case ' ':
                    key = ''
                    break
                case '=':
                    let token = this.handlePropTag(key)
                    log('key', key)
                    key = ''
                    return token
                case undefined:
                    return this.token['eof']
                default:
                    key += t
                    break
            }
            this.string = this.string.slice(this.pos)
            this.pos = 0
        }
    }

    handleStartTag() {
        let s = this.string.split(' ')[0]
        let type = s.slice(1)
        
        return [token.startTag, type]
    }

    handleEndTag() {
        this.advance()
        let idx = this.string.indexOf('>')
        let type = this.string.slice(this.pos, idx)
        this.pos += 3
        if (this.advance() != '>') {
            throw 'parse err'
        }
        return [token.endTag, type]
    }

    handlePropTag(key) {
        let idx = this.string.indexOf(' ')
        idx = idx == -1 ? this.string.indexOf('>') : idx
        let value = this.string.slice(this.pos, idx)
        log('value', value, this.pos, idx)
        return [this.token['propMap'], key, value]
    }
}

function main() {
    let str = `<div name='ad'></div>`
    let lexer = new Lexer(str)
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
}

main()

module.exports = token
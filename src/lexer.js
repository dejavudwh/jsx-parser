// <div name='mydiv'>
//     <span id='myspan'>
//         <p>text</p>
//     </span>
// </div>  
let log = require('./utils')

let token = {
    startTag: 'startTag',
    endTag: 'endTag',
    propKey: 'propKey',
    propVal: 'propVal',
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
        while (true) {
            let t = this.advance()
            let key = ''
            switch (t) {
                case '<':
                    if (this.lookAhead() === '/') {
                        return this.handleEndTag()
                    } else {
                        return this.handleStartTag()
                    }
                case ' ':
                    break
                case '=':
                    return this.handlePropTag()
                case undefined:
                    return this.token['eof']
                default:
                    key += t
            }
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

    handlePropTag() {
        
    }
}

function main() {
    let str = `</div>`
    let lexer = new Lexer(str)
    log(lexer.lex())
}

main()

module.exports = token
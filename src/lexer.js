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
                    break
                case undefined:
                    return this.token['eof']
                default:
                    break
            }
            this.string = this.string.slice(this.pos)
            this.pos = 0
        }
    }

    handleStartTag() {
        let s = this.string.split(' ')[0]
        let type = s.slice(1)
        this.pos += 3
        let props = this.handlePropTag()
        return [token.startTag, type, props]
    }

    handleEndTag() {
        this.advance()
        let idx = this.string.indexOf('>')
        let type = this.string.slice(this.pos, idx)
        this.pos += 3
        if (this.advance() != '>') {
            throw 'parse err! miss match '>''
        }
        return [token.endTag, type]
    }

    handlePropTag() {
        // let idx = this.string.indexOf(' ')
        // idx = idx == -1 ? this.string.indexOf('>') : idx
        // let value = this.string.slice(this.pos + 1, idx - 1)
        // log('value', value, this.pos, idx)
        // return [this.token['propMap'], key, value]
        this.advance()
        let idx = this.string.indexOf('>')
        if (idx == -1) {
            throw 'parse err'
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
        log('pm', pm)
        this.pos += string.length
        return pm
    }
}

function main() {
    let str = `<div name="{{ad}}"    class="fuck" id="1"></div>`
    let lexer = new Lexer(str)
    log('lex', lexer.lex())
    log('lex', lexer.lex())
    log('lex', lexer.lex())
}

main()

module.exports = token
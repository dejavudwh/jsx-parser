let Lexer = require('./lexer')
let log = require('./utils')

class Jsx {
    constructor(type, props) {
        this.type = type
        this.props = props
    }
}

class JsxParser {
    constructor(string) {
        this.lexer = new Lexer(string)
        this.tokens = this.lexer.token
        this.tags = []
        this.jsx = {}
        this.currentJsx = this.jsx
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
        let props = this.mergeObj(this.currentToken[2])
        let func = this.parseMap[type]
        if (func != undefined) {
            func(tag, props)
        } else {
            this.parseMap['error']()
        }

        if (this.tags.length > 0) {
            throw 'parse error! Mismatched start and end tags'
        }

        return this.jsx
    }

    parseStart(tag, props) {
        let len = this.tags.length
        let jsx = this.jsx
        if (len >= 1) {
            for (let i = 0; i < len; i++) {
                if (len >= 2 && i >= 1) {
                    jsx = jsx[jsx.length - 1]['props']['childrens']
                } else {
                    jsx = jsx.props['childrens']
                }
            }
            this.currentJsx = new Jsx(tag, {
                'childrens': []
            })
            Object.assign(this.currentJsx['props'], props)
            jsx.push(this.currentJsx)
        } else {
            jsx = new Jsx(tag, {
                'childrens': []
            })
            Object.assign(jsx['props'], props)
            this.jsx = jsx
        }
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
        this.currentJsx['props']['text'] = tag
        this.parse()
    }

    parseEof() {
        return
    }

    parseErr() {
        throw `parse err! syntax err `
    }

    mergeObj(objs) {
        let o = {}
        for (let i = 0; i < objs.length; i++) {
            Object.assign(o, objs[i])
        }

        return o
    }
}

module.exports = JsxParser

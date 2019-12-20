let JsxParser = require('./parse')
let log = require('./utils')

let str = `<div name="{{ad}}"    class="fuck" id="1">
                this is text
                <span name="asd">
                    <p>fu ck</p>
                </span> 
                <div>
                    <span name="zxc">
                        <p>thi nk</p>
                    </span> 
                    <Counter>
                    </Counter>
                </div>  
            </div>
            `

let jp = new JsxParser(str)
let jsx = jp.parse()
log(JSON.stringify(jsx, null, 2))
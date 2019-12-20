let JsxParser = require('./parse')
let log = require('./utils')

let str = `<div name="{{jsx-parse}}" class="{{fuck}}" id="1">
                Life is too difficult
                <span name="life" like="rape">
                    <p>Life is like rape</p>
                </span> 
                <div>
                    <span name="live" do="{{gofuck}}">
                        <p>Looking away, everything is sad                        </p>
                    </span> 
                    <Counter me="excellent">
                        I am awesome
                    </Counter>
                </div>  
            </div>
            `

let jp = new JsxParser(str)
let jsx = jp.parse()
log(JSON.stringify(jsx, null, 2))
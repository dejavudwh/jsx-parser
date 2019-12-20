# jsx-parser

![](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![](https://img.shields.io/badge/category-learning-blue.svg)
[![](https://img.shields.io/badge/blog-@dejavudwh-red.svg)](https://dejavudwh.cn/)
![](http://progressed.io/bar/82?title=done)

> This is a lightweight string to jsx obj parser, Only 250 lines of code


# Usage

parse function returns a jsx object

```JavaScript
let JsxParser = require('./parse')

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
```

## Output

```json
{
  "type": "div",
  "props": {
    "childrens": [
      {
        "type": "span",
        "props": {
          "childrens": [
            {
              "type": "p",
              "props": {
                "childrens": [],
                "text": "Life is like rape"
              }
            }
          ],
          "name": "life",
          "like": "rape"
        }
      },
      {
        "type": "div",
        "props": {
          "childrens": [
            {
              "type": "span",
              "props": {
                "childrens": [
                  {
                    "type": "p",
                    "props": {
                      "childrens": [],
                      "text": "Looking away, everything is sad"
                    }
                  }
                ],
                "name": "live",
                "do": "{{gofuck}}"
              }
            },
            {
              "type": "Counter",
              "props": {
                "childrens": [],
                "me": "excellent",
                "text": "I am awesome"
              }
            }
          ]
        }
      }
    ],
    "name": "{{jsx-parse}}",
    "class": "{{fuck}}",
    "id": "1",
    "text": "Life is too difficult"
  }
}
```


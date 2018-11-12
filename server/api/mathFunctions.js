const Parser = require('expr-eval').Parser
const parser = new Parser()
const math = require('mathjs')

console.log(parser)

const add = (a, b) => {
  return a + b
}
const minus = (a, b) => {
  return a - b
}

const textRecognition = str => {
  console.log(math.eval(str))
  return math.eval(str)
}

module.exports = {add, minus, textRecognition}

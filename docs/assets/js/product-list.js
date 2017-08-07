$(function () {
  getProductList().then(function (response) {
    renderProductList()
  })
})

function renderProductList (response) {
  console.log('product list rendered')
}

function getProductList () {
  return new Promise(function (resolve, reject) {
    var response = '[{"id":1,"name":"product 1"},{"id":2,"name":"product 2"}'
    // setTimeout(function () {
      resolve(JSON.parse(response)) // SyntaxError: Unexpected end of JSON input
    // }, 500)
  })
}

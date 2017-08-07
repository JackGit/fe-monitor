$(function () {
  $('select').material_select()
})

function addProduct () {
  var product = getFormData()
  storeProductLocally(product)
}

function getFormData () {
  return {}
}

function storeProductLocally (product) {
  localStorage.save('product', product)
}

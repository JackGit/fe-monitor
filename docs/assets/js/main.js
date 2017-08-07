$(function () {
  // generate a async error
  setTimeout(function () {
    doSomething()
  }, 100)
})

function doSomething (data) {
  return data.map(function (item) {
    return item.text
  })
}

function getUserInfo () {
  // Cannot read property 'user' of null
  return localStorage.getItem('data').user
}

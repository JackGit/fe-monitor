FM.Exception.GlobalHandler.install()
FM.Exception.TryCatchWrapper.install()
FM.Exception.wrap(function () {})
FM.Exception.wrap(exception)

FM.Inspector.Performance.install()
FM.Inspector.HTTP.install()
FM.Inspector.DOM.install()

FM.Tracer.trace({
  type: 'exception',
  level: 'high',
  name: 'SyntaxError',
  message: '',
  stack: [],
  createdAt: ''
}).trace({
  type: 'resource',
  name: '',
  startTiming: 0,
  endTiming: 0,
  duration: 0
}).trace({
  type: 'ajax',
  url: '',
  method: 'GET',
  startTiming: 0,
  endTiming: 0,
  duration: 0,
  statusCode: 404
}).trace({
  type: 'jsonp',
  url: '',
  startTiming: 0,
  endTiming: 0,
  duration: 0
}).trace({
  type: 'pageview', // PV/UV
  createdAt: 0
}).trace({
  type: 'visit',
  name: 'duration',
  url: '', // page url
}).trace({
  type: 'customized',

}).report()

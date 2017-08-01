const config = {
  reportUrl: 'http://yotta-tech.cn:4141/trace',
  projectId: 'dummy-project-id',
  enableGlobalExceptionHandler: true,
  enableTryCatchWrapper: true,
  enableNavigationTiming: true,
  enableResourceTiming: true,
  enableAjaxInspector: true,
  enableFetchInspector: true
}

export default function (options) {
  if (options) {
    Object.assign(config, options)
  } else {
    return config
  }
}

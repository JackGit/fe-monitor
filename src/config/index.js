const config = {
  reportUrl: 'http://fm.jackyang.me/trace',
  projectId: '',
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

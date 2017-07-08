import { restore } from '../utils/wrap'
import { installGlobalErrorHandler } from './global'

const replacementTracker = []

export function installGlobalErrorHandler () {
  installNormalUncaughtErrorHandler(replacementTracker)
  installPromiseUncaughtErrorHandler(replacementTracker)
}

export function uninstallGlobalErrorHandler () {
  restore(replacementTracker)
}

const buildIns = Object.create(null)

export function saveBuildIn (key, obj, prop, body) {
  buildIns[key] = [obj, prop, body]
}

export function getBuildIn (key) {
  return buildIns[key]
}

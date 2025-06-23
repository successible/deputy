import { isProduction } from './isProduction'

export const getGistFileName = () => {
  const filename = isProduction() ? 'badges.json' : 'badges-dev.json'
  return filename
}

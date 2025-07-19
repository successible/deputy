import { isProduction } from './isProduction'

export const getGistFileName = () => {
  const filename = isProduction() ? 'deputy.json' : 'deputy-dev.json'
  return filename
}

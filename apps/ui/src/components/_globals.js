import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

export const componentRegistration = ({ app }) => {
  const componentFiles = import.meta.globEager(
    '../components/base/*.vue'
  )

  Object.entries(componentFiles).forEach(([path, m]) => {
    const componentName = upperFirst(
      camelCase(path.split('/').pop().replace(/\.\w+$/, ''))
    )

    app.component(
      componentName, m.default
    )
  })
}

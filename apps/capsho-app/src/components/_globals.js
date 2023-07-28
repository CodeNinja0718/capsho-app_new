import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

export const componentRegistration = ({ app }) => {
  const requireComponent = require.context(
    '.',
    false,
    /App[A-Z]\w+\.(vue)$/
  )

  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)

    const componentName = upperFirst(
      camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
    )

    app.component(componentName, componentConfig.default || componentConfig)
  })
}

import type { LoaderContext } from 'webpack'
import { UnpluginContext } from '../../types'

export default async function load (this: LoaderContext<any>, source: string) {
  const callback = this.async()
  const { unpluginName } = this.query
  const plugin = this._compiler?.$unpluginContext[unpluginName]

  if (!plugin?.load) {
    return callback(null, source)
  }

  const context: UnpluginContext = {
    error: error => this.emitError(typeof error === 'string' ? new Error(error) : error),
    warn: error => this.emitWarning(typeof error === 'string' ? new Error(error) : error)
  }

  let id = this.resource
  if (id.startsWith(plugin.__virtualModulePrefix)) {
    id = id.slice(plugin.__virtualModulePrefix.length)
  }

  const res = await plugin.load.call(context, id)

  if (res == null) {
    callback(null, source)
  } else {
    callback(null, res)
  }
}

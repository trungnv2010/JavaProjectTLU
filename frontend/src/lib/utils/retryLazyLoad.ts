import { ComponentType } from 'react'
import { lazy } from 'react'

export const retryLoadComponent = async (
  fn: () => Promise<any>,
  retriesLeft = 5,
  interval = 1500
): Promise<{ default: ComponentType<any> }> => {
  try {
    return await fn()
  } catch (error: unknown) {
    if (retriesLeft) {
      await wait(interval)
      return retryLoadComponent(fn, retriesLeft - 1, interval)
    } else {
      throw new Error(error as string)
    }
  }
}

const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const lazyWithRetry = (componentImport: any) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    )

    try {
      const component = await componentImport()

      window.localStorage.setItem('page-has-been-force-refreshed', 'false')

      return component
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.localStorage.setItem('page-has-been-force-refreshed', 'true')
        return window.location.reload()
      }

      throw error
    }
  })

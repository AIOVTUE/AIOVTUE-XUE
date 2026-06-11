export interface EChartsInstance {
  setOption: (option: Record<string, unknown>, notMerge?: boolean) => void
  resize: () => void
  dispose: () => void
  on: (event: string, query: string, handler: (params: Record<string, unknown>) => void) => void
}

declare global {
  interface Window {
    echarts?: {
      init: (el: HTMLElement, theme?: string) => EChartsInstance
      graphic?: {
        LinearGradient: new (
          x: number,
          y: number,
          x2: number,
          y2: number,
          colorStops: Array<{ offset: number, color: string }>,
        ) => unknown
      }
    }
  }
}

export function loadEcharts() {
  return new Promise<NonNullable<Window['echarts']>>((resolve, reject) => {
    if (window.echarts) {
      resolve(window.echarts)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@4.9.0/dist/echarts.min.js'
    script.async = true
    script.onload = () => {
      if (window.echarts)
        resolve(window.echarts)
      else
        reject(new Error('ECharts failed to load'))
    }
    script.onerror = () => reject(new Error('ECharts script load error'))
    document.head.appendChild(script)
  })
}

export function createGradient(
  echarts: NonNullable<Window['echarts']>,
  topColor = 'rgba(128, 255, 165)',
  bottomColor = 'rgba(1, 191, 236)',
) {
  return echarts.graphic?.LinearGradient
    ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: topColor },
        { offset: 1, color: bottomColor },
      ])
    : topColor
}

export function observeChartResize(
  el: HTMLElement | undefined,
  onResize: () => void,
) {
  if (!el)
    return () => {}

  let resizeTimer: ReturnType<typeof setTimeout> | undefined

  const scheduleResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(onResize, 100)
  }

  const observer = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(scheduleResize)
    : null

  observer?.observe(el)
  window.addEventListener('resize', scheduleResize)

  return () => {
    observer?.disconnect()
    window.removeEventListener('resize', scheduleResize)
    clearTimeout(resizeTimer)
  }
}

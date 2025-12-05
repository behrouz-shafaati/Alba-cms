const computedStyles = (
  styles?: Record<string, string>
): Record<string, string | number> => {
  const safeStyles = styles ?? {}
  const result: Record<string, string | number> = {}

  for (const [key, value] of Object.entries(safeStyles)) {
    if (value)
      if (key === 'opacity') {
        const num = parseFloat(value)
        result.opacity = isNaN(num) ? 1 : Math.min(Math.max(num / 100, 0), 1)
      } else if (key === 'padding') {
        result.padding = `${value?.top || 0}px ${value?.right || 0}px ${
          value?.bottom || 0
        }px ${value?.left || 0}px`
      } else if (key === 'margin') {
        result.margin = `${value?.top || 0}px ${value?.right || 0}px ${
          value?.bottom || 0
        }px ${value?.left || 0}px`
      } else if (key === 'borderRadius') {
        result.borderRadius = `${value?.top || 0}px ${value?.right || 0}px ${
          value?.bottom || 0
        }px ${value?.left || 0}px`
      } else if (key === 'boxShadow') {
        result['boxShadow'] = `${value?.inset ? 'inset ' : ''}${
          value?.x || 0
        }px ${value?.y || 0}px ${value?.blur || 0}px ${value?.spread || 0}px ${
          value?.color || ''
        }`
      } else if (key === 'fontSize') {
        result.fontSize = `${value}px `
      } else {
        result[key] = value
      }
  }

  return result
}

export default computedStyles

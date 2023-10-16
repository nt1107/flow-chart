export const rectangle = (contentWidth: number, contentHeight: number) => {
  return {
    width: contentWidth + 20,
    height: contentHeight + 10
  }
}

export const round = (contentWidth: number, contentHeight: number) => {
  const diameter = Math.max(contentWidth, contentHeight)
  return {
    width: diameter,
    height: diameter
  }
}

export const ellipse = (contentWidth: number, contentHeight: number) => {
  return {
    width: contentWidth + 30,
    height: contentHeight + 20
  }
}

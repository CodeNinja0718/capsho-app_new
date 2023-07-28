function getRandomElement(list: string[]) {
  return list[Math.floor(Math.random() * list.length)]
}

function getRandomColor() {
  return getRandomElement([
    '#958DF1',
    '#F98181',
    '#FBBC88',
    '#FAF594',
    '#70CFF8',
    '#94FADB',
    '#B9F18D'
  ])
}

function getRandomName() {
  return getRandomElement([
    'Ally Sheedy',
    'Alyssa Milano',
    'Axl Rose',
    'Christina Applegate',
    'Cyndi Lauper',
    'Debbie Harry',
    'Elton John',
    'Emilio Estevez',
    'Jennifer Grey',
    'Jerry Hall',
    'Joan Collins',
    'John Cusack',
    'Justine Bateman',
    'Lea Thompson',
    'Lisa Bonet',
    'Madonna',
    'Matthew Broderick',
    'Michael J. Fox',
    'Mickey Rourke',
    'Molly Ringwald',
    'Olivia Newton-John',
    'Ralph Macchio',
    'Rob Lowe',
    'Tom Cruise',
    'Winona Ryder'
  ])
}

export { getRandomColor, getRandomName }

function generateID(prefix='',suffix='') {
  
  const randomID = Math.random().toString(16).substring(2);
  return (
    prefix+randomID+suffix
  )
}

export default generateID;
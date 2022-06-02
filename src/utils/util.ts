const showAlert = (message: string | object) => {
  const content = typeof message === 'string' ? message : toString(message)
  alert(content)
}

const toString = (data: any) => JSON.stringify(data)

const on = (obj: any, ...args: any) => {
  obj.addEventListener(...args)
}

const off = (obj: any, ...args: any) => {
  obj.removeEventListener(...args)
}

export { showAlert, toString, on, off }

const tryParse = <T>(body: string): T | boolean => {
  try {
    const parsed = JSON.parse(body)
    return parsed as T
  } catch {
    return false
  }
}

export { tryParse }

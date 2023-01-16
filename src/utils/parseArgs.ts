const parseArgs = () => {
  const args = process.argv.slice(2)

  return args.reduce((acc, next) => {
    if (next.startsWith("--")) {
      const [key, value] = next.split("=")
      acc[key.slice(2)] = value
    }

    return acc
  }, {} as Record<string, string>)
}

export { parseArgs }

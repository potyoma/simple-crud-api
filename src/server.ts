import cluster from "cluster"
import { parseArgs } from "./utils/parseArgs"
import http from "http"
import router from "./routes/router"
import os from "os"
import "dotenv/config"

const port = process.env.PORT ?? 4000
const args = parseArgs()

export const app = http.createServer(router)

export const runServer = () => {
  const useCluster = args["cluster"]

  if (useCluster && cluster.isPrimary) {
    const cpus = os.cpus().length

    console.log(
      `Primary process ${process.pid} is running. Please, wait for workers`
    )

    for (let i = 0; i < cpus; i++) cluster.fork()

    return cluster.on("exit", worker =>
      console.log(`Worker ${worker.process.pid} died.`)
    )
  }

  return app.listen(port, () =>
    console.log(
      `${useCluster ? "Worker" : "Server"} ${
        process.pid
      } running at http://localhost:${port}/`
    )
  )
}

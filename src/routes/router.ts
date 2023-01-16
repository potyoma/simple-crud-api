import { IncomingMessage, ServerResponse } from "http"
import usersController from "../controllers/usersController"
import { NOT_FOUND, SERVER_ERROR } from "../constants"
import response from "../utils/response"

const router = async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-Type", "application/json")

  try {
    const [extension, entity, param, ...rest] =
      req.url?.slice(1).split("/") ?? []

    if (extension !== "api" || rest?.length > 0)
      return response.notFound(res, { message: NOT_FOUND })

    const bodyRaw = []
    for await (const chunk of req) bodyRaw.push(chunk)

    const body = Buffer.concat(bodyRaw).toString()

    switch (entity.toLowerCase()) {
      case "users":
        return usersController.handle(res, req.method, [param], body)
      default:
        return response.notFound(res, { message: NOT_FOUND })
    }
  } catch (err) {
    console.log(err)
    return response.crash(res, { message: SERVER_ERROR })
  }
}

export default router

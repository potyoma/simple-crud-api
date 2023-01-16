import { ServerResponse } from "http"

export interface Response {
  notFound: (res: ServerResponse, body?: any) => void
  invalid: (res: ServerResponse, body?: any) => void
  crash: (res: ServerResponse, body?: any) => void
  ok: (res: ServerResponse, body?: any) => void
  created: (res: ServerResponse, body?: any) => void
  noContent: (res: ServerResponse, body?: any) => void
}

const respond = (code: number) => (res: ServerResponse, body?: any) => {
  res.writeHead(code)
  res.end(JSON.stringify(body))
}

const response = {
  notFound: respond(404),
  invalid: respond(400),
  crash: respond(500),
  ok: respond(200),
  created: respond(201),
  noContent: respond(204),
} as Response

export default response

import supertest from "supertest"

const post = async (app: any, endpoint: string, body: any) =>
  await supertest(app).post(endpoint).send(JSON.stringify(body))

const get = async (app: any, endpoint: string) =>
  await supertest(app).get(endpoint)

const put = async (app: any, endpoint: string, body: any) =>
  await supertest(app).put(endpoint).send(JSON.stringify(body))

const remove = async (app: any, endpoint: string) =>
  await supertest(app).delete(endpoint)

export { post, get, put, remove }

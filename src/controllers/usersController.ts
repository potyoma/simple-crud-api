import { ServerResponse } from "http"
import { CreateUser } from "../viewModels/createUser"
import { UpdateUser } from "../viewModels/updateUser"
import { User } from "../models/user"
import { tryParse } from "../utils/parser"
import response from "../utils/response"
import { INVALID_UUID, NOT_FOUND, INVALID_MODEL } from "../constants"
import userRepository from "../repository/userRepository"
import { Users } from "../viewModels/users"

export interface UsersController {
  handle: (
    res: ServerResponse,
    method: string,
    params: string[],
    body?: any
  ) => void
}

const getAll = (res: ServerResponse) => {
  const users = userRepository.getAll()
  return response.ok(res, { users } as Users)
}

const get = (id: string, res: ServerResponse) => {
  if (!isValidUuid(id)) return response.invalid(res, { message: INVALID_UUID })

  const user = userRepository.get(id)

  return user
    ? response.ok(res, user)
    : response.notFound(res, { message: NOT_FOUND })
}

const create = (body: string, res: ServerResponse) => {
  const user = tryParse<CreateUser>(body)

  if (!isValidUser(user))
    return response.invalid(res, { message: INVALID_MODEL })

  const created = userRepository.add(user as User)
  return response.created(res, created)
}

const update = (id: string, body: string, res: ServerResponse) => {
  if (!isValidUuid(id)) return response.invalid(res, { message: INVALID_UUID })

  const user = tryParse<UpdateUser>(body)

  if (!isValidUpdateUser(user)) return response.invalid(res, { message: INVALID_MODEL })

  const updated = userRepository.update(id, user as User)

  return updated
    ? response.ok(res, updated)
    : response.notFound(res, { message: NOT_FOUND })
}

const remove = (id: string, res: ServerResponse) => {
  if (!isValidUuid(id)) return response.invalid(res, { message: INVALID_UUID })

  return userRepository.remove(id)
    ? response.noContent(res)
    : response.notFound(res, { message: NOT_FOUND })
}

const isValidUuid = (id: string) => {
  const pattern =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
  return id?.length > 0 ? pattern.test(id) : false
}

const isValidUpdateUser = (user: UpdateUser | boolean) => {
  if (!user) return false

  const userParsed = user as UpdateUser

  return userParsed.age || userParsed.username || userParsed.hobbies
}

const isValidUser = (user: CreateUser | boolean) => {
  if (!user) return false

  const parsedUser = user as CreateUser

  return (
    parsedUser.age && parsedUser.username && Array.isArray(parsedUser.hobbies)
  )
}

const handle = (
  res: ServerResponse,
  method: string,
  params: string[],
  body?: any
) => {
  if (params?.length > 1) return response.notFound(res, { message: NOT_FOUND })

  switch (method?.toLowerCase()) {
    case "get":
      return params?.[0] ? get(params[0], res) : getAll(res)
    case "post":
      return create(body, res)
    case "put":
      return update(params?.[0], body, res)
    case "delete":
      return remove(params?.[0], res)
    default:
      return response.notFound(res, { message: NOT_FOUND })
  }
}

export default { handle } as UsersController

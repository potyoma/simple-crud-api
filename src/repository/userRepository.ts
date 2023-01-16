import { User } from "../models/user"
import { generate } from "../utils/uuid"

export interface UserRepository {
  getAll: () => User[]
  add: (user: User) => User
  remove: (id: string) => boolean
  update: (id: string, user: User) => User
  get: (id: string) => User
}

let users = [] as User[]

const getAll = () => users

const add = (user: User) => {
  user.id = generate()
  users.push(user)
  return user
}

const remove = (id: string) => {
  const before = users.length
  console.log(id)
  console.log(before)
  users = users.filter(u => u.id !== id)
  console.log(users.length)
  return before !== users.length
}

const update = (id: string, user: User) => {
  const existingIndex = users.findIndex(u => u.id === id)
  const existing = users[existingIndex]

  if (existingIndex < 0) return null

  user.id = id
  user.age = user.age ?? existing.age
  user.username = user.username ?? existing.username
  user.hobbies = user.hobbies ?? existing.hobbies

  users[existingIndex] = user

  return user
}

const get = (id: string) => users.find(u => u.id === id)

const userRepository = { getAll, add, remove, update, get } as UserRepository

export default userRepository

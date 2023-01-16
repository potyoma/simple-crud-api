import { app } from "../src/server"
import { CreateUser } from "../src/viewModels/createUser"
import { UpdateUser } from "../src/viewModels/updateUser"
import { User } from "../src/models/user"
import { INVALID_MODEL, INVALID_UUID, NOT_FOUND } from "../src/constants"
import { get, post, put, remove } from "./testUtil"
import { Users } from "../src/viewModels/users"

const endpoint = "/api/users"

describe("1st scenario - all operations", () => {
  const fakeUser = {
    username: "Tabitha",
    age: 17,
    hobbies: ["running", "playing uke"],
  } as User

  it("should return no users when there's none", async () => {
    const response = await get(app, endpoint)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ users: [] } as Users)
  })

  it("should create new user", async () => {
    const expected = fakeUser
    const createUserDto = fakeUser as CreateUser

    const response = await post(app, endpoint, createUserDto)

    expect(response.statusCode).toBe(201)
    expect(response.body.id).not.toBe("")
    fakeUser.id = response.body.id
    expect(response.body).toEqual(expected)
  })

  it("should get user by existing id", async () => {
    const response = await get(app, `${endpoint}/${fakeUser.id}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(fakeUser)
  })

  it("should update existing user", async () => {
    const expected = fakeUser
    fakeUser.username = "Tom"
    fakeUser.hobbies = ["gaming"]

    const updateUserDto = {
      username: "Tom",
      hobbies: ["gaming"],
    } as UpdateUser

    const response = await put(app, `${endpoint}/${fakeUser.id}`, updateUserDto)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(expected)
  })

  it("should delete existing user", async () => {
    const response = await remove(app, `${endpoint}/${fakeUser.id}`)

    expect(response.statusCode).toBe(204)
  })

  it("should find no user when id does not exist", async () => {
    const id = fakeUser.id
    const expected = {  message: NOT_FOUND }

    const response = await get(app, `${endpoint}/${id}`)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual(expected)
  })
})

describe("2nd scenario - operations when there is no user for given id", () => {
  const fakeUser = {
    id: "e3e70309-5ed6-4a79-bc1c-2166d964ca7c",
    username: "Joe",
    age: 15,
    hobbies: ["ski", "music"],
  } as User

  it("should return no users", async () => {
    const response = await get(app, endpoint)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ users: [] } as Users)
  })

  it("should return 404", async () => {
    const id = fakeUser.id
    const expected = {  message: NOT_FOUND }

    const response = await get(app, `${endpoint}/${id}`)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual(expected)
  })

  it("should return 404 on update", async () => {
    const updateUserDto = fakeUser as UpdateUser
    const expected = {  message: NOT_FOUND }

    const response = await put(app, `${endpoint}/${fakeUser.id}`, updateUserDto)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual(expected)
  })

  it("should return 404 on delete", async () => {
    const expected = {  message: NOT_FOUND }

    const response = await remove(app, `${endpoint}/${fakeUser.id}`)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual(expected)
  })

  it("should return 404 on get non-exist endpoint", async () => {
    const expected = {  message: NOT_FOUND }

    const response = await get(app, `${endpoint}/${fakeUser.id}/wrong`)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual(expected)
  })
})

describe("3rd scenario - invalid input", () => {
  const fakeUser = {
    id: "e3e70309-5ed6-4a79-bc1c-2166d964ca7c",
    username: "Samantha",
    age: 24,
    hobbies: ["painting", "cooking", "3D modeling"],
  } as User

  const id = "invalid_id"

  it("should return 400 on wrong id format when looking for user", async () => {
    const expected = { message: INVALID_UUID }

    const response = await get(app, `${endpoint}/${id}`)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(expected)
  })

  it("should return 400 on wrong id format when updating user", async () => {
    const expected = { message: INVALID_UUID }

    const response = await put(app, `${endpoint}/${id}`, {})

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(expected)
  })

  it("should return 400 on wrong id format when deleting user", async () => {
    const id = "invalid_id"
    const expected = { message: INVALID_UUID }

    const response = await remove(app, `${endpoint}/${id}`)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(expected)
  })

  it("should return 400 on incomplete body data when creating user", async () => {
    const createUserDto = {
      username: "Clark",
      hobbies: ["running"],
    } as CreateUser
    const expected = { message: INVALID_MODEL }

    const response = await post(app, endpoint, createUserDto)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(expected)
  })

  const invalidModel = "invalidData"

  it("should return 400 on invalid body data when creating user", async () => {
    const expected = { message: INVALID_MODEL }

    const response = await post(app, endpoint, invalidModel)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(expected)
  })

  it("should return 400 on invalid body data when updating user", async () => {
    const id = fakeUser.id
    const expected = { message: INVALID_MODEL }

    const response = await put(app, `${endpoint}/${id}`, invalidModel)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(expected)
  })
})

import { response, Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { createUserValidationSchemaForBody } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helper.mjs";

const router = Router();

// router is called a mini application

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Filter must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("must be at least 3-10 characters"),
  (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("Inside Session Store Get");
      console.log(sessionData);
    });
    // console.log(request["express-validator#contexts"]);
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
  }
);

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchemaForBody),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());

    const data = matchedData(request);
    console.log(data); // Data will return request.body object through
    data.password = await hashPassword(data.password);
    console.log(data);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return response.status(201).json(savedUser);
    } catch (error) {
      console.log(error);
      return response.sendStatus(400);
    }
  }
);

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;

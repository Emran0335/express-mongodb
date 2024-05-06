import { mockUsers } from "./constants.mjs";

export const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);

  next();
};

export const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  // add property to the request object as it is the beauty of JavaScript
  request.findUserIndex = findUserIndex;
  next();
};

const swaggerAutogen = require("swagger-autogen")()

const doc = {
  info: {
    title: "Discussion Board API",
    description:
      "Documentation API. https://github.com/danielschmitz/discussionboard-api <br/><br/>",
    version: "1.0",
    contact: {
      name: "Daniel Schmitz",
      email: "danieljfa@gmail.com",
      url: "https://github.com/danielschmitz",
    },
  },
  host: null,
  schemes: ["http", "https"],
  basePath: "/api",
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      scheme: "bearer",
      in: "header",
    },
  },
  security: [{ bearerAuth: [] }],
  definitions: {
    UserResult: {
      id: 1,
      name: "User Name",
      email: "user@mail.com",
      isAdmin: 0,
    },
    User: {
      name: "User Name",
      email: "user@mail.com",
      password: "123456",
    },
    DiscussionResult: {
      id: 1,
      title: "title of discussion",
      description: "description of result",
      votes: 10,
      createdAt: "2023-05-17 15:33:34",
      userId: 1,
      userName: "Author Name",
    },
  },
}

const outputFile = "./src/swagger.json"
const endpointsFiles = [
  "./src/api/hello-world.js",
  "./src/api/auth.js",
  "./src/api/user.js",
  "./src/api/discussion.js",
]

swaggerAutogen(outputFile, endpointsFiles, doc)

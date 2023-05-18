const router = require("express").Router()
const db = require("../db")
const BadInputError = require("../errors/BadInputError")
const NotFoundError = require("../errors/NotFoundError")
const Joi = require("joi")
const auth = require("../auth")

const discussionSchema = Joi.object({
  title: Joi.string().min(3).max(80).required(),
  userId: Joi.number().required,
  description: Joi.string(),
})

router.get("/discussions", async (req, res) => {
  /*   
    #swagger.tags = ['Discussions']
    #swagger.summary = 'Get All Discussions'
    #swagger.responses[200] = { 
    schema: [ { $ref: "#/definitions/DiscussionResult" } ],
            description: "A list of discussions" }  
    */
  res.json(
    await db("discussions")
      .orderBy("discussions.id", "DESC")
      .join("users", "discussions.userId", "users.id")
      .select("discussions.*", "users.name as userName")
  )
})

router.get("/discussion/:id", async (req, res) => {
  /*   
    #swagger.tags = ['Discussions']
    #swagger.summary = 'Get a Discussion'
    #swagger.responses[200] = { 
    schema: { $ref: "#/definitions/DiscussionResult" },
            description: "A discussion by id" }  
    */
  const { id } = req.params

  // #swagger.responses[422] = { description: 'Invalid input' }
  if (!parseInt(id)) throw new BadInputError("Invalid id")

  const discussion = await db("discussions")
    .orderBy("discussions.id", "DESC")
    .join("users", "discussions.userId", "users.id")
    .select("discussions.*", "users.name as userName")
    .where("discussions.id", id)

  if (discussion.length === 0) throw new NotFoundError("Discussion Not Found")

  res.json(discussion[0])
})

router.post("/discussion", auth.checkLogin, async (req, res) => {
  /*   
    #swagger.tags = ['Discussions']
    #swagger.summary = '🔒️ Create a Discussion'
    #swagger.parameters['discussion'] = {
                in: 'body',
                description: 'Discussion Data',
                required: true,
                schema: { $ref: "#/definitions/Discussion" }
    #swagger.responses[200] = { 
    schema: { $ref: "#/definitions/DiscussionResult" },
            description: "Discussion Created" }  
    */
  const discussion = req.body

  try {
    await discussionSchema.validateAsync(discussion)
  } catch (error) {
    // #swagger.responses[422] = { description: 'Invalid input' }
    throw new BadInputError(error.message)
  }

  const { title, description } = discussion
  const userId = auth.getTokenData(req).id

  const result = await db("discussions").insert({ title, description, userId })

  const id = result[0]

  res.json(await db("discussions").where({ id }).first())
})

module.exports = router

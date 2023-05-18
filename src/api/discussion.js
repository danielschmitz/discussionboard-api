const router = require("express").Router()
const db = require("../db")
// const Joi = require("joi")

// const discussionSchema = Joi.object({
//   title: Joi.string().min(3).max(80).required(),
//   userId: Joi.integer().required,
// })

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

module.exports = router

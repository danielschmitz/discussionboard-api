require("dotenv").config()

const jwt = require("jsonwebtoken")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const db = require("../db")
const UnauthorizedError = require("../errors/UnauthorizedError")
const BadInputError = require("../errors/BadInputError")
const NotFoundError = require("../errors/NotFoundError")

const JWT_SECRET = "47bce5c74f589f4867dbd57e9ca9f808"

const userSchema = Joi.object({
  password: Joi.string().min(3).max(30).required(),
  email: Joi.string().required().email(),
})

class auth {
  /**
   * Try to login
   * @param {*} user
   * @returns token
   */
  tryLogin = async (user) => {
    const { email, password } = user
    await this.validateInputData(email, password)
    const userDb = await this.validateUser(email, password)
    const token = this.generateToken({
      id: userDb.id,
      email: userDb.email,
      isAdmin: userDb.isAdmin,
    })
    return token
  }
  /**
   * Verify if token its corrects
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  checkLogin = async (req, res, next) => {
    const token = req.headers["authorization"]
    if (!token) {
      throw new UnauthorizedError("Token not present")
    }
    // eslint-disable-next-line no-undef
    jwt.verify(token, JWT_SECRET, function (err, auth) {
      if (err) {
        throw new UnauthorizedError("Unauthorized")
      } else {
        req.auth = auth
        next()
      }
    })
  }
  /**
   * Verify if token its corrects and user Is Admin
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  checkAdmin = async (req, res, next) => {
    const token = req.headers["authorization"]
    if (!token) {
      throw new UnauthorizedError("Token not present")
    }
    // eslint-disable-next-line no-undef
    jwt.verify(token, JWT_SECRET, function (err, auth) {
      if (err) {
        throw new UnauthorizedError("Unauthorized")
      } else {
        if (auth.isAdmin) {
          req.auth = auth
          next()
        }
        throw new UnauthorizedError("Unauthorized Admin Access")
      }
    })
  }
  /**
   * Get id and email of the logged user
   * @param {*} req
   * @returns
   */
  getTokenData = (req) => ({
    id: req.auth.id,
    email: req.auth.email,
  })

  /**
   * Generates a token from user data and JWT_SECRET
   * @param {*} user
   * @returns
   */
  generateToken(user) {
    return jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      // eslint-disable-next-line no-undef
      JWT_SECRET,
      { expiresIn: "1w" }
    )
  }
  /**
   * Check ifs email/password exists
   * @param {*} email
   * @param {*} password
   */
  async validateUser(email, password) {
    const userDb = await db("users").where({ email }).first()
    if (!userDb) {
      throw new NotFoundError("No user found with that email")
    }
    const valid = await bcrypt.compare(password, userDb.password)
    if (!valid) {
      throw new UnauthorizedError("Incorrect password")
    }
    return userDb
  }

  /**
   * Validate user input data
   * @param {*} email
   * @param {*} password
   */
  async validateInputData(email, password) {
    try {
      await userSchema.validateAsync({ email, password })
    } catch (error) {
      throw new BadInputError(error.message)
    }
  }
}

module.exports = new auth()

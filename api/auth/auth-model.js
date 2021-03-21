const db = require("../../data/dbConfig")

function find() {
	return db("users")
}

function findById(id) {
	return db("users")
  .where({ id })
  .first()
}

function findByUsername(username) {
	return db("users")
  .where({ username })
  .first()
}

async function create(user) {
	const [id] = await db("users").insert(user)
	return findById(id)
}


module.exports = {
  find,
  findById,
  create,
  findByUsername,
};
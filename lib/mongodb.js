import { MongoClient } from "mongodb"

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://henriccorb_db_user:ricco900@monometro.b018gvn.mongodb.net/?retryWrites=true&w=majority&appName=Monometro"

console.log("[v0] MongoDB URI configurada:", uri ? "✓ URI encontrada" : "✗ URI não encontrada")

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client
let clientPromise

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log("[v0] MongoDB conectado com sucesso em desenvolvimento")
        return client
      })
      .catch((error) => {
        console.error("[v0] Erro ao conectar MongoDB em desenvolvimento:", error)
        throw error
      })
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client
    .connect()
    .then((client) => {
      console.log("[v0] MongoDB conectado com sucesso em produção")
      return client
    })
    .catch((error) => {
      console.error("[v0] Erro ao conectar MongoDB em produção:", error)
      throw error
    })
}

export default clientPromise

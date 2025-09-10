import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// 🔎 Helper para validar ObjectId
function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id
}

// GET - Buscar todos os manômetros
export async function GET() {
  try {
    console.log("[v1] Iniciando busca de manômetros...")
    const client = await clientPromise
    const db = client.db("Monometro")

    const manometros = await db.collection("data").find({}).toArray()
    console.log("[v1] Manômetros encontrados:", manometros.length)

    return NextResponse.json({ success: true, data: manometros })
  } catch (error) {
    console.error("[v1] Erro GET /api/manometros:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar manômetros", details: error.message },
      { status: 500 }
    )
  }
}

// POST - Criar novo manômetro
export async function POST(request) {
  try {
    console.log("[v1] Iniciando criação de manômetro...")
    const client = await clientPromise
    const db = client.db("Monometro")
    const body = await request.json()
    console.log("[v1] Dados recebidos:", body)

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: "Dados do manômetro são obrigatórios" },
        { status: 400 }
      )
    }

    const manometro = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("data").insertOne(manometro)
    console.log("[v1] Manômetro criado com ID:", result.insertedId)

    return NextResponse.json({
      success: true,
      data: { ...manometro, _id: result.insertedId },
    })
  } catch (error) {
    console.error("[v1] Erro POST /api/manometros:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao criar manômetro", details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Atualizar manômetro
export async function PUT(request) {
  try {
    console.log("[v1] Iniciando atualização de manômetro...")
    const client = await clientPromise
    const db = client.db("Monometro")
    const body = await request.json()
    const { _id, ...updateData } = body
    console.log("[v1] Dados recebidos para atualização:", body)

    if (!_id || !isValidObjectId(_id)) {
      return NextResponse.json(
        { success: false, error: "ID do manômetro inválido" },
        { status: 400 }
      )
    }

    const result = await db.collection("data").updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    )
    console.log("[v1] Resultado da atualização:", result)

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Manômetro não encontrado" },
        { status: 404 }
      )
    }

    const updated = await db.collection("data").findOne({ _id: new ObjectId(_id) })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("[v1] Erro PUT /api/manometros:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar manômetro", details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Deletar manômetro
export async function DELETE(request) {
  try {
    console.log("[v1] Iniciando deleção de manômetro...")
    const client = await clientPromise
    const db = client.db("Monometro")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    console.log("[v1] ID recebido para deleção:", id)

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "ID do manômetro inválido" },
        { status: 400 }
      )
    }

    const result = await db.collection("data").deleteOne({ _id: new ObjectId(id) })
    console.log("[v1] Resultado da deleção:", result)

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Manômetro não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "Manômetro deletado com sucesso", deletedId: id })
  } catch (error) {
    console.error("[v1] Erro DELETE /api/manometros:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao deletar manômetro", details: error.message },
      { status: 500 }
    )
  }
}

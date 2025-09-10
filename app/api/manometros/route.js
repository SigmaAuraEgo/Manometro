import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Buscar todos os manômetros
export async function GET() {
  try {
    console.log("[v0] Iniciando busca de manômetros...")
    const client = await clientPromise
    console.log("[v0] Cliente MongoDB conectado")

    const db = client.db("Monometro")
    console.log("[v0] Database 'Monometro' selecionado")

    const manometros = await db.collection("data").find({}).toArray()
    console.log("[v0] Manômetros encontrados:", manometros.length)

    return NextResponse.json({ success: true, data: manometros })
  } catch (error) {
    console.error("[v0] Erro detalhado ao buscar manômetros:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// POST - Criar novo manômetro
export async function POST(request) {
  try {
    console.log("[v0] Iniciando criação de manômetro...")
    const client = await clientPromise
    const db = client.db("Monometro")
    const body = await request.json()
    console.log("[v0] Dados recebidos:", body)

    const manometro = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("data").insertOne(manometro)
    console.log("[v0] Manômetro criado com ID:", result.insertedId)

    return NextResponse.json({
      success: true,
      data: { ...manometro, _id: result.insertedId },
    })
  } catch (error) {
    console.error("[v0] Erro detalhado ao criar manômetro:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// PUT - Atualizar manômetro
export async function PUT(request) {
  try {
    console.log("[v0] Iniciando atualização de manômetro...")
    const client = await clientPromise
    const db = client.db("Monometro")
    const body = await request.json()
    const { _id, ...updateData } = body
    console.log("[v0] Dados recebidos para atualização:", body)

    if (!_id) {
      console.error("[v0] ID do manômetro é obrigatório")
      return NextResponse.json({ success: false, error: "ID do manômetro é obrigatório" }, { status: 400 })
    }

    const result = await db.collection("data").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )
    console.log("[v0] Resultado da atualização:", result)

    if (result.matchedCount === 0) {
      console.error("[v0] Manômetro não encontrado")
      return NextResponse.json({ success: false, error: "Manômetro não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] Erro detalhado ao atualizar manômetro:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// DELETE - Deletar manômetro
export async function DELETE(request) {
  try {
    console.log("[v0] Iniciando deleção de manômetro...")
    const client = await clientPromise
    const db = client.db("Monometro")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    console.log("[v0] ID recebido para deleção:", id)

    if (!id) {
      console.error("[v0] ID do manômetro é obrigatório")
      return NextResponse.json({ success: false, error: "ID do manômetro é obrigatório" }, { status: 400 })
    }

    const result = await db.collection("data").deleteOne({ _id: new ObjectId(id) })
    console.log("[v0] Resultado da deleção:", result)

    if (result.deletedCount === 0) {
      console.error("[v0] Manômetro não encontrado")
      return NextResponse.json({ success: false, error: "Manômetro não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Manômetro deletado com sucesso" })
  } catch (error) {
    console.error("[v0] Erro detalhado ao deletar manômetro:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

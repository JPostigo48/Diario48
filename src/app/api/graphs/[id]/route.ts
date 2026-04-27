import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { validateGraphInput } from "@/lib/graph/utils";
import GraphModel from "@/lib/models/Graph";

export const dynamic = "force-dynamic";

async function getGraphById(id: string) {
  await connectToDatabase();
  return GraphModel.findById(id).lean();
}

function invalidIdResponse() {
  return NextResponse.json({ error: "ID de grafo inválido." }, { status: 400 });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    const graph = await getGraphById(id);

    if (!graph) {
      return NextResponse.json({ error: "Grafo no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ data: graph });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo obtener el grafo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    const payload = await request.json();
    const validation = validateGraphInput(payload);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: validation.errors },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const updated = await GraphModel.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Grafo no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo actualizar el grafo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    await connectToDatabase();
    const deleted = await GraphModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Grafo no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ data: deleted });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo eliminar el grafo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

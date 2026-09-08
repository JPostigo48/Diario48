import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { ensureLegacyOwnershipMigration } from "@/lib/auth/ownership";
import { getCurrentUser } from "@/lib/auth/session";
import { getGraphAccessContext } from "@/lib/graph/access";
import { connectToDatabase } from "@/lib/db/mongodb";
import { validateGraphInput } from "@/lib/graph/utils";
import GraphModel from "@/lib/models/Graph";

export const dynamic = "force-dynamic";

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
    await ensureLegacyOwnershipMigration();
    const currentUser = await getCurrentUser();
    const graphAccess = await getGraphAccessContext(
      id,
      currentUser ? String(currentUser._id) : null,
    );

    if (!graphAccess) {
      return NextResponse.json({ error: "Grafo no encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      data: graphAccess.graph,
      meta: {
        accessMode: graphAccess.accessMode,
        visibility: graphAccess.graph.visibility,
      },
    });
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
    await ensureLegacyOwnershipMigration();
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const ownerId = String(auth.user._id);
    const payload = await request.json();
    const validation = validateGraphInput(payload);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: validation.errors },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const updated = await GraphModel.findOneAndUpdate(
      { _id: id, ownerId },
      { ...validation.data, ownerId },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

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
    await ensureLegacyOwnershipMigration();
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const ownerId = String(auth.user._id);
    await connectToDatabase();
    const deleted = await GraphModel.findOneAndDelete({ _id: id, ownerId }).lean();

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

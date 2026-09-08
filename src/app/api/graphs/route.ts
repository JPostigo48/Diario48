import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { ensureLegacyOwnershipMigration } from "@/lib/auth/ownership";
import { connectToDatabase } from "@/lib/db/mongodb";
import { validateGraphInput } from "@/lib/graph/utils";
import GraphModel from "@/lib/models/Graph";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    await ensureLegacyOwnershipMigration();
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const ownerId = String(auth.user._id);
    const graphs = await GraphModel.find({ ownerId }).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ data: graphs });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudieron obtener los grafos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const created = await GraphModel.create({
      ...validation.data,
      ownerId,
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo guardar el grafo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

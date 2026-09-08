import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import {
  createResearchWorkspace,
  listResearchWorkspaces,
} from "@/lib/research/repository";
import { validateResearchWorkspaceInput } from "@/lib/research/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    return NextResponse.json({
      data: await listResearchWorkspaces({
        ownerId: String(auth.user._id),
      }),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudieron obtener los workspaces bibliográficos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const payload = await request.json();
    const validation = validateResearchWorkspaceInput(payload);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: validation.errors },
        { status: 400 },
      );
    }

    const created = await createResearchWorkspace(validation.data, {
      ownerId: String(auth.user._id),
    });

    return NextResponse.json(
      {
        data: created,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo crear el workspace bibliográfico.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

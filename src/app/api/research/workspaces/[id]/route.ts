import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth/api";
import { getCurrentUser } from "@/lib/auth/session";
import {
  deleteResearchWorkspace,
  getAccessibleResearchWorkspaceById,
  getResearchWorkspaceById,
  replaceResearchWorkspace,
} from "@/lib/research/repository";
import { validateResearchWorkspaceInput } from "@/lib/research/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();
    const access = await getAccessibleResearchWorkspaceById(
      id,
      currentUser ? String(currentUser._id) : null,
    );

    if (!access?.workspace) {
      return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      data: access.workspace,
      meta: {
        accessMode: access.accessMode,
        visibility: access.workspace.visibility,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo obtener el workspace bibliográfico.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
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

    const updated = await replaceResearchWorkspace(id, validation.data, {
      ownerId: String(auth.user._id),
    });

    if (!updated) {
      return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo actualizar el workspace bibliográfico.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const ownerId = String(auth.user._id);
    const existing = await getResearchWorkspaceById(id, { ownerId });

    if (!existing) {
      return NextResponse.json({ error: "Workspace no encontrado." }, { status: 404 });
    }

    await deleteResearchWorkspace(id, { ownerId });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo eliminar el workspace bibliográfico.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

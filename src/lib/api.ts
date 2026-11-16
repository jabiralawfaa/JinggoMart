import { NextResponse } from "next/server";
import type { FieldErrors } from "./validators";

export function unauthorized(message = "Tidak terautentikasi.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Anda tidak punya akses untuk tindakan ini.") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message: string, errors?: FieldErrors) {
  return NextResponse.json({ error: message, errors }, { status: 400 });
}

export function notFound(message = "Data tidak ditemukan.") {
  return NextResponse.json({ error: message }, { status: 404 });
}

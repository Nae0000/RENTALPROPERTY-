import { NextResponse } from "next/server";

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({ data, meta }, { status: 200 });
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function fail(
  code: string,
  message: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json(
    {
      error: { code, message, details }
    },
    { status }
  );
}

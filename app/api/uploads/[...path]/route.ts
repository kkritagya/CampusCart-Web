import { API_SERVER_URL } from "@/lib/api/endpoint";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!path.length || path.some((part) => part === "..")) {
    return NextResponse.json({ message: "Invalid image path" }, { status: 400 });
  }
  const source = `${API_SERVER_URL}/uploads/${path
    .map(encodeURIComponent)
    .join("/")}`;
  const response = await fetch(source, { cache: "no-store" });
  if (!response.ok) {
    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }
  return new NextResponse(response.body, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

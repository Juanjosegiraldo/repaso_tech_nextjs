import connectDB from "@/lib/database";

// GET /api/health -> verifies the MongoDB connection is working.
export async function GET() {
  try {
    await connectDB();
    return Response.json(
      { data: null, code: 200, message: "DB Online" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { data: null, code: 500, message },
      { status: 500 }
    );
  }
}

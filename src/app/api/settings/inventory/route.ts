import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { getLowStockThreshold, setSetting } from "@/lib/settings";
import { lowStockThresholdSchema } from "@/features/settings/settings-validation";

export async function GET() {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const threshold = await getLowStockThreshold();
    return successResponse({ lowStockThreshold: threshold });
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const body = await request.json();
    const result = lowStockThresholdSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Validation failed";
      return errorResponse(errorMessage, 400);
    }

    await setSetting("lowStockThreshold", result.data.threshold.toString());
    return successResponse({ lowStockThreshold: result.data.threshold }, "Low stock threshold updated");
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { getRecentOrders } from "@/features/dashboard/dashboard-service";

export async function GET() {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const orders = await getRecentOrders(5);
    return successResponse(orders);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }
    return errorResponse("Internal server error", 500);
  }
}

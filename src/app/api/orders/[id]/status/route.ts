import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { updateOrderStatus } from "@/features/orders/orders-service";
import { orderStatusSchema } from "@/features/orders/orders-validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const body = await request.json();
    const { status } = orderStatusSchema.parse(body);
    const order = await updateOrderStatus(id, status, authResult.userId);
    return successResponse(order, "Order status updated");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

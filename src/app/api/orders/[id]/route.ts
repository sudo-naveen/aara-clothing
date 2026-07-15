import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { getOrderById, updateOrder, deleteOrder } from "@/features/orders/orders-service";
import { updateOrderSchema } from "@/features/orders/orders-validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) return errorResponse("Order not found", 404);
    return successResponse(order);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const body = await request.json();
    const input = updateOrderSchema.parse(body);
    const order = await updateOrder(id, input);
    return successResponse(order, "Order updated");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    await deleteOrder(id);
    return successResponse(null, "Order deleted");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

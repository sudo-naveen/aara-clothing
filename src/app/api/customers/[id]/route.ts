import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { getCustomerById, updateCustomer, deleteCustomer } from "@/features/customers/customers-service";
import { updateCustomerSchema } from "@/features/customers/customers-validation";
import { notifyAllUsers } from "@/features/notifications/notify-all";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { id } = await params;
    const customer = await getCustomerById(id);
    if (!customer) return errorResponse("Customer not found", 404);
    return successResponse(customer);
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
    const input = updateCustomerSchema.parse(body);
    const customer = await updateCustomer(id, input);
    if (!customer) return errorResponse("Customer not found", 404);
    return successResponse(customer, "Customer updated");
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

    const { userId, username } = authResult;
    const { id } = await params;

    const existing = await getCustomerById(id);
    if (!existing) return errorResponse("Customer not found", 404);

    const customer = await deleteCustomer(id);
    if (!customer) return errorResponse("Customer not found", 404);

    await notifyAllUsers(
      "Customer Removed",
      `"${existing.name}" was removed by ${username}`,
      userId
    );

    return successResponse(null, "Customer deleted");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";
import { listCustomers, createCustomer } from "@/features/customers/customers-service";
import { createCustomerSchema, customerQuerySchema } from "@/features/customers/customers-validation";
import { notifyAllUsers } from "@/features/notifications/notify-all";

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { searchParams } = new URL(request.url);
    const query = customerQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await listCustomers(query);
    return successResponse(result);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) return authResult.error;

    const { userId, username } = authResult;
    const body = await request.json();
    const input = createCustomerSchema.parse(body);
    const customer = await createCustomer(input);

    await notifyAllUsers(
      "New Customer",
      `"${customer.name}" was added by ${username}`,
      userId,
      "customer"
    );

    return successResponse(customer, "Customer created", 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

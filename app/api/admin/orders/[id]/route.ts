import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { serializeAdminOrder, type AdminOrderRecord } from "@/app/lib/admin-orders";
import { fulfillmentStatuses, Order } from "@/app/models/order";
import { User } from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Please sign in to update admin orders." }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "You do not have permission to update admin orders." }, { status: 403 });
  }

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "The order ID is invalid." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const bodyKeys = body && typeof body === "object" ? Object.keys(body) : [];
  const fulfillmentStatus = body?.fulfillmentStatus;

  if (
    bodyKeys.length !== 1 ||
    bodyKeys[0] !== "fulfillmentStatus" ||
    typeof fulfillmentStatus !== "string" ||
    !fulfillmentStatuses.includes(fulfillmentStatus as (typeof fulfillmentStatuses)[number])
  ) {
    return NextResponse.json({ error: "Provide one valid fulfillment status." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { fulfillmentStatus } },
      { new: true, runValidators: true },
    )
      .select("items delivery razorpayOrderId razorpayPaymentId amount status paymentStatus fulfillmentStatus userId createdAt")
      .lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const user = await User.findById(order.userId).select("name email").lean();

    return NextResponse.json({
      order: serializeAdminOrder(order as AdminOrderRecord, user),
    });
  } catch {
    return NextResponse.json({ error: "Unable to update the order right now." }, { status: 500 });
  }
}
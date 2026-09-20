import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Order } from "@/app/models/order";
import { User } from "@/app/models/user";
import { serializeAdminOrder, type AdminOrderRecord } from "@/app/lib/admin-orders";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Please sign in to view admin orders." }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "You do not have permission to view admin orders." }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const orders = await Order.find()
      .select("items delivery razorpayOrderId razorpayPaymentId amount status paymentStatus fulfillmentStatus userId createdAt")
      .sort({ createdAt: -1 })
      .lean();
    const userIds = [...new Set(orders.map((order) => order.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } }).select("name email").lean();
    const usersById = new Map(users.map((user) => [user._id.toString(), user]));

    return NextResponse.json({
      orders: orders.map((order) =>
        serializeAdminOrder(order as AdminOrderRecord, usersById.get(order.userId.toString()) ?? null),
      ),
    });
  } catch {
    return NextResponse.json({ error: "Unable to load admin orders right now." }, { status: 500 });
  }
}
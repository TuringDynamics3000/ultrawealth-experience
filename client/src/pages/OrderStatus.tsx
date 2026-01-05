import { useLocation, useParams } from "wouter";
import { Layout } from "@/components/Layout";

export default function OrderStatus() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();

  // Mock order data
  const orderData = {
    orderId: params.id || "839204",
    status: "Filled",
    quantity: 25,
    price: "$101.60",
    broker: "ASX Venue",
    fees: "$9.50",
    timestamp: "10:41 AM",
  };

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto px-5 py-8">
        
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black mb-8">
          Order status
        </h1>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Order ID</span>
              <span className="text-base font-medium text-black">{orderData.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-base font-semibold text-black">{orderData.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Execution</span>
              <span className="text-base font-medium text-black">
                {orderData.quantity} units @ {orderData.price}
              </span>
            </div>
          </div>
        </div>

        {/* Execution Details */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Broker</span>
              <span className="text-sm font-medium text-black">{orderData.broker}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Fees</span>
              <span className="text-sm font-medium text-black">{orderData.fees}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Timestamp</span>
              <span className="text-sm font-medium text-black">{orderData.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-6" />

        {/* View Details Button */}
        <button
          onClick={() => setLocation(`/activity/act-${orderData.orderId}`)}
          className="w-full py-4 rounded-full text-base font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
        >
          View details
        </button>
      </div>
    </Layout>
  );
}

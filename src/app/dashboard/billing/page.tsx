"use client";

import { useState } from "react";
import { CreditCard, Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out our basic features.",
    features: [
      "Up to 10 images per month",
      "Basic background removal",
      "Standard image upscaling",
      "Community support",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professionals who need more power and features.",
    features: [
      "Unlimited images",
      "Advanced background removal",
      "High-quality image upscaling",
      "Object removal",
      "Smart cropping",
      "Color enhancement",
      "Priority support",
      "API access",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom needs.",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantees",
      "Custom training",
      "Advanced analytics",
      "Team management",
      "Custom branding",
    ],
    current: false,
  },
];

const paymentMethods = [
  {
    id: "visa",
    type: "Visa",
    last4: "4242",
    expiry: "12/24",
    default: true,
  },
  {
    id: "mastercard",
    type: "Mastercard",
    last4: "8888",
    expiry: "06/25",
    default: false,
  },
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and payment methods.
        </p>
      </div>

      {/* Current plan */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Pro Plan</p>
              <p className="text-sm text-gray-500">
                Your next billing date is March 1, 2024
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Change plan
            </button>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Add payment method
          </button>
        </div>
        <div className="mt-6">
          <ul role="list" className="divide-y divide-gray-200">
            {paymentMethods.map((method) => (
              <li key={method.id} className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {method.type} ending in {method.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {method.expiry}
                    </p>
                  </div>
                </div>
                {method.default && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Default
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Billing history */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
        <div className="mt-6">
          <div className="overflow-hidden rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    Feb 1, 2024
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    Pro Plan - Monthly
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    $29.00
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    Paid
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    Jan 1, 2024
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    Pro Plan - Monthly
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    $29.00
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    Paid
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
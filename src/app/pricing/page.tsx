import Link from "next/link";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    id: "free",
    href: "/signup",
    price: { monthly: "$0" },
    description: "Perfect for trying out our basic features.",
    features: [
      "Up to 10 images per month",
      "Basic background removal",
      "Standard image upscaling",
      "Community support",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "pro",
    href: "/signup",
    price: { monthly: "$29" },
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
    featured: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    href: "/contact",
    price: { monthly: "Custom" },
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
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Choose the plan that's right for you. All plans include a 14-day free trial.
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
              tier.featured ? "lg:z-10 lg:rounded-b-none" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h2
                  className={`text-lg font-semibold leading-8 ${
                    tier.featured ? "text-primary" : "text-gray-900"
                  }`}
                >
                  {tier.name}
                </h2>
                {tier.featured && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {tier.price.monthly}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  /month
                </span>
              </p>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className="h-6 w-5 flex-none text-primary"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={tier.href}
              className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                tier.featured
                  ? "bg-primary text-white hover:bg-primary/90 focus-visible:outline-primary"
                  : "bg-white text-primary ring-1 ring-inset ring-primary hover:ring-primary/20"
              }`}
            >
              Get started
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          Need a custom plan?{" "}
          <Link href="/contact" className="text-primary hover:text-primary/80">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
} 
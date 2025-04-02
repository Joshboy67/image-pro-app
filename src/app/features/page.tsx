import Link from "next/link";

const features = [
  {
    name: "Background Removal",
    description: "Remove backgrounds from images instantly with our AI-powered tool. Perfect for product photos, portraits, and more.",
    icon: "🎨",
  },
  {
    name: "Image Upscaling",
    description: "Enhance image quality and resolution without losing detail. Transform low-resolution images into high-quality ones.",
    icon: "🔍",
  },
  {
    name: "Object Removal",
    description: "Remove unwanted objects from your images seamlessly. Clean up photos and remove distractions.",
    icon: "✨",
  },
  {
    name: "Smart Cropping",
    description: "Automatically crop images to focus on the main subject while maintaining composition.",
    icon: "✂️",
  },
  {
    name: "Color Enhancement",
    description: "Adjust colors, contrast, and saturation to make your images pop.",
    icon: "🎯",
  },
  {
    name: "Batch Processing",
    description: "Process multiple images at once to save time and maintain consistency.",
    icon: "⚡",
  },
];

export default function FeaturesPage() {
  return (
    <div className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Powerful Image Editing Features
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Transform your images with our suite of AI-powered editing tools. From background removal to image upscaling, we've got you covered.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                <span className="text-2xl">{feature.icon}</span>
                {feature.name}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">{feature.description}</p>
                <p className="mt-6">
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold leading-6 text-primary hover:text-primary/80"
                  >
                    Try it now <span aria-hidden="true">→</span>
                  </Link>
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-16 text-center">
        <Link
          href="/pricing"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          View Pricing Plans
        </Link>
      </div>
    </div>
  );
} 
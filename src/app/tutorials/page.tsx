import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tutorials | ImagePro",
  description: "Step-by-step tutorials for using ImagePro's image processing tools",
};

const tutorials = [
  {
    title: "How to Remove Image Backgrounds",
    description: "Learn to remove backgrounds with just a few clicks using our AI tools.",
    image: "/placeholder-tutorial-1.jpg",
    duration: "5 min",
    level: "Beginner",
  },
  {
    title: "Batch Processing for Social Media",
    description: "Create consistent images for multiple social media platforms at once.",
    image: "/placeholder-tutorial-2.jpg",
    duration: "8 min",
    level: "Intermediate",
  },
  {
    title: "Creating Custom Filter Presets",
    description: "Design and save your own custom filters for quick access.",
    image: "/placeholder-tutorial-3.jpg",
    duration: "6 min",
    level: "Beginner",
  },
  {
    title: "Advanced Color Correction Techniques",
    description: "Master professional color grading and correction methods.",
    image: "/placeholder-tutorial-4.jpg",
    duration: "12 min",
    level: "Advanced",
  },
  {
    title: "Optimizing Images for Web Performance",
    description: "Make your images load faster without sacrificing quality.",
    image: "/placeholder-tutorial-5.jpg",
    duration: "7 min",
    level: "Intermediate",
  },
  {
    title: "AI-Powered Image Enhancement",
    description: "Leverage our AI tools to automatically enhance image quality.",
    image: "/placeholder-tutorial-6.jpg",
    duration: "4 min",
    level: "Beginner",
  },
];

export default function TutorialsPage() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Tutorials</h1>
        <p className="text-xl mb-12 text-muted-foreground">
          Step-by-step guides to help you make the most of ImagePro
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="border rounded-lg overflow-hidden group hover:border-primary transition-colors">
              <div className="relative h-48 bg-muted">
                {/* Replace with actual images when available */}
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">Tutorial Image</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-muted px-2.5 py-0.5 rounded-full">{tutorial.duration}</span>
                  <span className="text-xs bg-muted px-2.5 py-0.5 rounded-full">{tutorial.level}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Read Tutorial →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Request a Tutorial</h2>
          <p className="mb-6 text-muted-foreground">
            Can't find what you're looking for? Let us know what you'd like to learn!
          </p>
          <form className="grid gap-4 max-w-xl">
            <input
              type="text"
              placeholder="Your name"
              className="w-full border rounded-md px-4 py-2"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full border rounded-md px-4 py-2"
            />
            <textarea
              placeholder="What would you like us to create a tutorial about?"
              className="w-full border rounded-md px-4 py-2 min-h-[100px]"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors w-fit"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 
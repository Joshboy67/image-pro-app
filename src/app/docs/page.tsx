import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | ImagePro",
  description: "Detailed documentation for using ImagePro's image processing features",
};

export default function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Documentation</h1>
        <p className="text-xl mb-12 text-muted-foreground">
          Learn how to use ImagePro's powerful image processing features
        </p>

        <div className="grid gap-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="prose max-w-none">
              <p>
                Welcome to ImagePro's documentation. This guide will help you get started with our image processing platform.
              </p>
              <h3>Account Setup</h3>
              <p>
                To begin using ImagePro, you'll need to create an account. Visit our <a href="/auth/signup" className="text-primary hover:underline">signup page</a> and follow the instructions.
              </p>
              <h3>Uploading Your First Image</h3>
              <p>
                Once logged in, you can upload images from your dashboard. We support JPG, PNG, WebP, and GIF formats up to 10MB in size.
              </p>
              <ol>
                <li>Navigate to your dashboard</li>
                <li>Click the "Upload" button or drag and drop files</li>
                <li>Wait for the upload to complete</li>
                <li>Your image is now ready for editing</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
            <div className="prose max-w-none">
              <h3>Basic Editing</h3>
              <p>
                ImagePro offers a range of basic editing tools:
              </p>
              <ul>
                <li><strong>Crop & Resize</strong>: Adjust dimensions while maintaining quality</li>
                <li><strong>Rotate & Flip</strong>: Reorient your images as needed</li>
                <li><strong>Brightness & Contrast</strong>: Fine-tune lighting</li>
                <li><strong>Color Adjustment</strong>: Modify saturation, hue, and temperature</li>
              </ul>

              <h3>Advanced Features</h3>
              <p>
                For more sophisticated editing needs:
              </p>
              <ul>
                <li><strong>AI Enhancement</strong>: Automatically improve image quality</li>
                <li><strong>Background Removal</strong>: Isolate subjects with precision</li>
                <li><strong>Batch Processing</strong>: Edit multiple images simultaneously</li>
                <li><strong>Custom Filters</strong>: Apply and save your own filter presets</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <a href="/tutorials" className="block p-6 border rounded-lg hover:border-primary transition-colors">
                <h3 className="text-xl font-medium mb-2">Tutorials</h3>
                <p className="text-muted-foreground">
                  Step-by-step guides for common editing tasks
                </p>
              </a>
              <a href="/api" className="block p-6 border rounded-lg hover:border-primary transition-colors">
                <h3 className="text-xl font-medium mb-2">API Reference</h3>
                <p className="text-muted-foreground">
                  Integrate ImagePro into your applications
                </p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 
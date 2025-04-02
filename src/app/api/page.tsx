import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference | ImagePro",
  description: "Integrate ImagePro's image processing capabilities into your applications",
};

export default function ApiPage() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">API Reference</h1>
        <p className="text-xl mb-12 text-muted-foreground">
          Integrate ImagePro's powerful image processing capabilities into your applications
        </p>

        <div className="grid gap-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="prose max-w-none">
              <p>
                The ImagePro API allows you to access our image processing capabilities programmatically. 
                Follow these steps to get started:
              </p>
              
              <h3>Authentication</h3>
              <p>
                All API requests require an API key. You can generate an API key in your account settings.
              </p>
              
              <div className="bg-muted p-4 rounded-md my-4">
                <pre className="text-sm overflow-x-auto">
                  curl -X GET https://api.imagepro.com/v1/status
                  -H "Authorization: Bearer YOUR_API_KEY"
                </pre>
              </div>
              
              <h3>Rate Limits</h3>
              <p>
                Free accounts are limited to 100 requests per day. Premium plans have higher limits.
                See our <a href="/pricing" className="text-primary hover:underline">pricing page</a> for details.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
            
            <div className="border rounded-lg overflow-hidden mb-6">
              <div className="p-4 bg-primary/5 border-b">
                <div className="flex items-center">
                  <span className="px-2 py-1 mr-3 bg-green-100 text-green-800 rounded text-xs font-medium">POST</span>
                  <span className="font-mono">/v1/images/process</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Process an image</h3>
                <p className="text-muted-foreground mb-4">
                  Apply various transformations and effects to an image.
                </p>
                <div className="bg-muted p-4 rounded-md mb-4">
                  <pre className="text-sm overflow-x-auto">
                  # Example command to resize and convert to grayscale
                  curl -X POST https://api.imagepro.com/v1/images/process
                  -H "Authorization: Bearer YOUR_API_KEY"
                  -F "image=@/path/to/image.jpg"
                  -F "width=800"
                  -F "filter=grayscale"
                  </pre>
                </div>
                <h4 className="font-medium mt-4 mb-2">Parameters</h4>
                <ul className="space-y-2">
                  <li className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="font-mono text-sm">image</span>
                    <span className="text-sm text-muted-foreground">The image file to process (required)</span>
                  </li>
                  <li className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="font-mono text-sm">width</span>
                    <span className="text-sm text-muted-foreground">Width to resize the image to (optional)</span>
                  </li>
                  <li className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="font-mono text-sm">filter</span>
                    <span className="text-sm text-muted-foreground">Filter to apply (optional)</span>
                  </li>
                  <li className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="font-mono text-sm">output_format</span>
                    <span className="text-sm text-muted-foreground">Desired output format (jpg, png, webp). Defaults to original format.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-primary/5 border-b">
                <div className="flex items-center">
                  <span className="px-2 py-1 mr-3 bg-blue-100 text-blue-800 rounded text-xs font-medium">GET</span>
                  <span className="font-mono">/v1/images/{"{id}"}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Get image details</h3>
                <p className="text-muted-foreground mb-4">
                  Retrieve metadata about a processed image.
                </p>
                <div className="bg-muted p-4 rounded-md mb-4">
                  <pre className="text-sm overflow-x-auto">
                  curl -X GET https://api.imagepro.com/v1/images/abc123
                  -H "Authorization: Bearer YOUR_API_KEY"
                  </pre>
                </div>
                <h4 className="font-medium mt-4 mb-2">Parameters</h4>
                <ul className="space-y-2">
                  <li className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="font-mono text-sm">id</span>
                    <span className="text-sm text-muted-foreground">The ID of the processed image (required)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">SDKs and Libraries</h2>
            <p className="mb-6 text-muted-foreground">
              We provide official client libraries for popular programming languages:
            </p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <a href="#" className="block p-6 border rounded-lg hover:border-primary transition-colors">
                <h3 className="text-xl font-medium mb-2">JavaScript</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Integrate with web applications and Node.js
                </p>
                <span className="text-sm font-medium text-primary">View Documentation →</span>
              </a>
              <a href="#" className="block p-6 border rounded-lg hover:border-primary transition-colors">
                <h3 className="text-xl font-medium mb-2">Python</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect for data science and backend applications
                </p>
                <span className="text-sm font-medium text-primary">View Documentation →</span>
              </a>
              <a href="#" className="block p-6 border rounded-lg hover:border-primary transition-colors">
                <h3 className="text-xl font-medium mb-2">PHP</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Integrate with web applications and CMS platforms
                </p>
                <span className="text-sm font-medium text-primary">View Documentation →</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 
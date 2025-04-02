import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const contactInfo = [
  {
    name: "Email",
    description: "support@imagepro.com",
    icon: Mail,
    href: "mailto:support@imagepro.com",
  },
  {
    name: "Phone",
    description: "+1 (555) 123-4567",
    icon: Phone,
    href: "tel:+15551234567",
  },
  {
    name: "Office",
    description: "123 Image Street, Design City, DC 12345",
    icon: MapPin,
    href: "https://maps.google.com",
  },
];

export default function ContactPage() {
  return (
    <div className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Get in touch
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mt-20 lg:max-w-none lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="flex-auto">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              {contactInfo.map((item) => (
                <div key={item.name} className="flex gap-x-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-7 text-foreground">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-1">
                      <Link
                        href={item.href}
                        className="text-sm font-semibold leading-6 text-primary hover:text-primary/80"
                      >
                        Contact us <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <form className="flex flex-col gap-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-foreground"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-foreground"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-foreground"
            >
              Message
            </label>
            <div className="mt-2">
              <textarea
                id="message"
                name="message"
                rows={4}
                className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Send message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
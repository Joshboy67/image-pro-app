# Updating Supabase Dependencies

To use the latest Supabase authentication with Next.js App Router, you need to update your dependencies. Here are the instructions:

## Removing Deprecated Package
```bash
npm uninstall @supabase/auth-helpers-nextjs
```

## Installing New Package
```bash
npm install @supabase/ssr
```

## Package.json Example
Your package.json dependencies should include:

```json
"dependencies": {
  "@supabase/ssr": "^0.1.0",
  "@supabase/supabase-js": "^2.49.1",
  // other dependencies...
}
```

## TypeScript Configuration

If your project uses TypeScript and you encounter type errors related to the new @supabase/ssr package, you may need to update your TypeScript configuration or add type definitions manually.

### Type Parameters for Cookie Handlers

When using createServerClient, ensure you add proper type annotations for the cookie handlers:

```typescript
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => 
        cookieStore.set(name, value, options),
      remove: (name: string, options: any) => 
        cookieStore.set(name, '', { ...options, maxAge: 0 }),
    },
  }
);
```

This ensures you won't have TypeScript errors related to implicit any types. 
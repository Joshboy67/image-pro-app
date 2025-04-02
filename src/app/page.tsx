'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowRight, ImageIcon, ZapIcon, ShieldIcon, CheckCircle2, Star, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero section */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <motion.div 
              className="flex flex-col justify-center space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <motion.div 
                  className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 px-3 py-1 text-sm text-blue-700 dark:text-blue-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="mr-2">✨</span> AI-Powered Image Processing
                </motion.div>
                <motion.h1 
                  className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Transform your images with AI
                </motion.h1>
                <motion.p 
                  className="text-lg text-muted-foreground md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Professional-grade image editing made simple. Remove backgrounds, upscale, enhance, and more with our AI-powered tools.
                </motion.p>
              </div>
              <motion.div 
                className="flex flex-col gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/#features">Learn More</Link>
                </Button>
              </motion.div>
              <motion.div 
                className="flex items-center gap-4 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-400" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4 text-blue-500" />
                  <span>10K+ Users</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-green-500" />
                  <span>Instant Processing</span>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-blue-100 dark:bg-blue-900/20"></div>
              <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-blue-200 dark:bg-blue-800/20"></div>
              <div className="relative mx-auto aspect-square overflow-hidden rounded-lg border shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-24 w-24 text-white opacity-75" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <motion.div 
        id="features" 
        className="bg-muted py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Transform Your Images Instantly</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our AI-powered tools make professional image editing accessible to everyone.
            </p>
          </motion.div>
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div 
                key={feature.name} 
                className="group rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium">{feature.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* How it works section */}
      <motion.div 
        className="py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, fast, and efficient image processing in three easy steps
            </p>
          </motion.div>
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div 
                key={step.title} 
                className="relative"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Benefits section */}
      <motion.div 
        className="bg-muted py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Us</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience the difference with our professional image processing tools
            </p>
          </motion.div>
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {benefits.map((benefit) => (
              <motion.div 
                key={benefit.title} 
                className="flex items-start gap-4 rounded-lg bg-card p-6 shadow-sm"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="text-lg font-medium">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* CTA section */}
      <motion.div 
        className="bg-blue-600 py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Ready to transform your images?
          </motion.h2>
          <motion.p 
            className="mx-auto mt-4 max-w-xl text-lg text-blue-100"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Get started today and experience the power of AI image processing.
          </motion.p>
          <motion.div 
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/dashboard">Start Editing Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
              <Link href="/#features">View Features</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

const features = [
  {
    name: 'Background Remover',
    description: 'Remove backgrounds from images with a single click. Perfect for product photos and portraits.',
    icon: ImageIcon,
  },
  {
    name: 'Image Upscaler',
    description: 'Enhance low-resolution images without losing quality. Increase size up to 4x.',
    icon: ZapIcon,
  },
  {
    name: 'Object Removal',
    description: 'Remove unwanted objects from your photos. Our AI fills in the background seamlessly.',
    icon: ShieldIcon,
  },
  {
    name: 'Image Enhancement',
    description: 'Automatic color correction, contrast enhancement, and noise reduction.',
    icon: ImageIcon,
  },
];

const steps = [
  {
    title: 'Upload Your Image',
    description: 'Simply drag and drop or select your image to get started.',
  },
  {
    title: 'Choose Your Tool',
    description: 'Select from our suite of AI-powered image processing tools.',
  },
  {
    title: 'Download Result',
    description: 'Get your processed image instantly, ready for use.',
  },
];

const benefits = [
  {
    title: 'Professional Quality',
    description: 'Get results that match professional editing standards with our advanced AI technology.',
  },
  {
    title: 'Lightning Fast',
    description: 'Process your images in seconds, not hours. No more waiting for complex edits.',
  },
  {
    title: 'Easy to Use',
    description: 'No technical skills required. Our intuitive interface makes editing simple.',
  },
  {
    title: 'Secure Processing',
    description: 'Your images are processed securely and never stored permanently.',
  },
];

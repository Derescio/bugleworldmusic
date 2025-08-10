import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 text-orange-400 mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-white/70 text-lg mb-8">
            The product you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="space-y-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Link href="/store">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Store
              </Link>
            </Button>
            <br />
            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

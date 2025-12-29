import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved or doesn't exist.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </Button>
        <Button asChild>
          <Link to="/docs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            View Docs
          </Link>
        </Button>
      </div>
    </div>
  )
}

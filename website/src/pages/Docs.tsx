export function Docs() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Documentation</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Learn how to use FormKeeper in your projects.
        </p>
        <div className="prose dark:prose-invert max-w-none">
          <h2>Getting Started</h2>
          <p>Install FormKeeper via NPM:</p>
          <pre className="bg-zinc-900 p-4 rounded-lg">
            <code>npm install @oxog/formkeeper</code>
          </pre>
          <p className="mt-8 text-muted-foreground">More documentation coming soon...</p>
        </div>
      </div>
    </div>
  )
}

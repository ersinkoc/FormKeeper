import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Code } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

interface Example {
  id: string
  title: string
  description: string
  tags: string[]
  difficulty: Difficulty
}

const examples: Example[] = [
  {
    id: 'login-form',
    title: 'Login Form',
    description: 'Basic authentication form with email and password validation.',
    tags: ['React', 'Validation'],
    difficulty: 'Beginner',
  },
  {
    id: 'registration',
    title: 'Registration Form',
    description: 'Multi-field registration with password confirmation and terms agreement.',
    tags: ['React', 'Validation', 'Checkbox'],
    difficulty: 'Beginner',
  },
  {
    id: 'dynamic-fields',
    title: 'Dynamic Fields',
    description: 'Add and remove form fields dynamically using useFieldArray.',
    tags: ['React', 'Array Fields'],
    difficulty: 'Intermediate',
  },
  {
    id: 'multi-step-wizard',
    title: 'Multi-Step Wizard',
    description: 'Step-by-step form with progress indicator using Wizard plugin.',
    tags: ['React', 'Wizard', 'Plugin'],
    difficulty: 'Intermediate',
  },
  {
    id: 'async-validation',
    title: 'Async Validation',
    description: 'Username availability check with debounced async validation.',
    tags: ['React', 'Async', 'Validation'],
    difficulty: 'Intermediate',
  },
  {
    id: 'schema-validation',
    title: 'Zod Schema Validation',
    description: 'Form validation using Zod schemas with SchemaPlugin.',
    tags: ['React', 'Zod', 'Plugin'],
    difficulty: 'Advanced',
  },
  {
    id: 'autosave',
    title: 'Auto-save Draft',
    description: 'Automatically save form progress with the Autosave plugin.',
    tags: ['React', 'Autosave', 'Plugin'],
    difficulty: 'Intermediate',
  },
  {
    id: 'nested-objects',
    title: 'Nested Objects',
    description: 'Handle complex nested form data with dot notation paths.',
    tags: ['React', 'Nested'],
    difficulty: 'Advanced',
  },
]

const difficultyColors: Record<Difficulty, 'success' | 'warning' | 'info'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'info',
}

export function Examples() {
  return (
    <div className="container py-12">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4">Examples</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Explore real-world examples showing how to use FormKeeper for common
          form patterns. Each example includes full source code.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <motion.div
            key={example.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={difficultyColors[example.difficulty]}>
                    {example.difficulty}
                  </Badge>
                  <Code className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {example.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to={"/examples/" + example.id}>
                    View Example
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-muted-foreground mb-4">
          Want to try these examples live?
        </p>
        <Button asChild>
          <Link to="/playground">
            Open Playground
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

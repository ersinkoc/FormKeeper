interface Prop {
  name: string
  type: string
  required?: boolean
  default?: string
  description: string
}

interface PropsTableProps {
  props: Prop[]
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-border rounded-lg">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Property</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-t border-border">
              <td className="px-4 py-2">
                <code className="text-sm">{prop.name}</code>
                {prop.required && <span className="text-red-500 ml-1">*</span>}
              </td>
              <td className="px-4 py-2 text-muted-foreground text-sm font-mono">
                {prop.type}
              </td>
              <td className="px-4 py-2 text-muted-foreground text-sm">
                {prop.description}
                {prop.default && (
                  <span className="ml-2 text-xs">
                    (default: <code>{prop.default}</code>)
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

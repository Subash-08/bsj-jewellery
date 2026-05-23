export function SchemaScript({ schema }: { schema: object | object[] }) {
  const data = Array.isArray(schema) ? schema : [schema]
  return (
    <>
      {data.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}

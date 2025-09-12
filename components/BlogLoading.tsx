// components/BlogLoading.tsx
export default function BlogLoading() {
  return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </section>
  )
}
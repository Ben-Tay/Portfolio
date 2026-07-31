export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Benedict Tay. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, shadcn/ui, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

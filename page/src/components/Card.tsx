export default function Card({ children }: { children: React.ReactNode }) {
  return <div
    className="group/link cursor-pointer px-5 py-3 bg-p-accent rounded-lg relative"
  >
    <div>
      {children}
    </div>
    <div
      className="group-hover/link:ml-1 group-hover/link:-mt-1 absolute w-full h-full z-10 bg-p-secondary-background top-0 left-0 rounded-lg"
    >
      <div className="flex items-center justify-center h-full font-bold">
        {children}
      </div>
    </div>
  </div>
}
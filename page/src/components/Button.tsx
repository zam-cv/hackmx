export default function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button {...props}
      className="group/link cursor-pointer px-5 py-3 bg-cyan-300 rounded-lg relative max-h-14 w-full"
    >
      <div>
        {props.children}
      </div>
      <div
        className="group-hover/link:ml-1 group-hover/link:-mt-1 absolute w-full h-full z-10 bg-p-blue top-0 left-0 rounded-lg"
      >
        <div className="flex items-center justify-center h-full font-bold">
          {props.children}
        </div>
      </div>
    </button>
  );
}

export function BtnDelete(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <div
      className="group/link cursor-pointer px-5 py-3 bg-red-300 rounded-lg relative max-h-14"
    >
      <div>
        {props.children}
      </div>
      <button
        className="group-hover/link:ml-1 group-hover/link:-mt-1 absolute w-full h-full z-10 bg-red-600 top-0 left-0 rounded-lg"
        {...props}
      >
        <div className="flex items-center justify-center h-full font-bold">
          {props.children}
        </div>
      </button>
    </div>
  );
}

export function ButtonDisabled({ children }: { children: React.ReactNode }) {
  return <button
    className="group-hover/link:ml-1 group-hover/link:-mt-1 max-h-14 z-10 px-5 py-3 bg-[#4b4d82] top-0 left-0 rounded-lg cursor-auto"
  >
    <div className="flex items-center justify-center h-full font-bold">
      {children}
    </div>
  </button>
}

export function ButtonPrimary(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <Button
      className="p-3 px-5 rounded-md outline-none bg-red-600 hover:bg-red-500"
      {...props}
    />
  );
}

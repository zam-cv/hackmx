export default function Tec({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <a href="https://tec.mx" target="_blank" rel="noreferrer">
        <img
          src="/tec.png"
          alt="Tec de Monterrey"
          className={className ?? "md:h-16 h-12 w-auto object-contain"}
        />
      </a>
    </div>
  );
}
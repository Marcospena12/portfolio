type PageHeadingProps = {
  eyebrow: string;
  title: string;
};

export function PageHeading({ eyebrow, title }: PageHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-3 pb-12 text-center">
      <span className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase opacity-70">
        {eyebrow}
      </span>
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="mt-1 h-[3px] w-12 rounded-full bg-foreground/30" />
    </div>
  );
}
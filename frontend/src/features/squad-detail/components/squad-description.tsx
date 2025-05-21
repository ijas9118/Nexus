interface SquadDescriptionProps {
  description: string;
}

export function SquadDescription({ description }: SquadDescriptionProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">About</h2>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

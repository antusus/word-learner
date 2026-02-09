interface HintProps {
  translation: string;
}

export function Hint({ translation }: HintProps) {
  return (
    <div className="fib-hint">
      <p className="fib-prompt">{translation}</p>
    </div>
  );
}

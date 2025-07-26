
'use client';

export function VoiceVisualizer() {
  return (
    <div className="flex items-center justify-center gap-1 h-10">
      <span className="w-1 h-2 rounded-full bg-foreground animate-[voice-pulse_0.8s_infinite_ease-in-out] [animation-delay:-0.4s]" />
      <span className="w-1 h-4 rounded-full bg-foreground animate-[voice-pulse_0.8s_infinite_ease-in-out] [animation-delay:-0.2s]" />
      <span className="w-1 h-6 rounded-full bg-foreground animate-[voice-pulse_0.8s_infinite_ease-in-out]" />
      <span className="w-1 h-4 rounded-full bg-foreground animate-[voice-pulse_0.8s_infinite_ease-in-out] [animation-delay:0.2s]" />
      <span className="w-1 h-2 rounded-full bg-foreground animate-[voice-pulse_0.8s_infinite_ease-in-out] [animation-delay:0.4s]" />
    </div>
  );
}

// Confetti.tsx
import { useCallback } from "react";
import { loadConfettiPreset } from "tsparticles-preset-confetti";
import Particles from "react-tsparticles";
import { type Engine } from "tsparticles-engine";

export const Confetti = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadConfettiPreset(engine);
  }, []);

  return (
    <Particles
      id="confetti"
      init={particlesInit}
      options={{
        preset: "confetti",
        fullScreen: { zIndex: 9999 },
      }}
    />
  );
};

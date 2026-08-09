import { Transition } from "framer-motion";

export function useChatAnimations() {
  const smoothSpring: Transition = {
    type: "spring",
    stiffness: 80,
    damping: 20,
    mass: 0.8,
  };

  return { smoothSpring };
}

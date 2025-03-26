import { cn } from "@/lib/utils";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface TabOption {
  label: string;
  value: string;
}

interface Props {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TabMotion = ({ options, value, onChange, className }: Props) => {
  const activeIndex = options.findIndex((option) => option.value === value);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState({
    width: 0,
    left: 0,
  });

  const updateSliderPosition = useCallback(() => {
    const activeButton = buttonsRef.current[activeIndex];
    if (!activeButton) return;

    const container = activeButton.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const buttonLeft = buttonRect.left - containerRect.left;

    setSliderStyle({
      width: buttonRect.width,
      left: buttonLeft,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    // Initial position update
    updateSliderPosition();

    // Add resize listener
    const handleResize = () => {
      window.requestAnimationFrame(updateSliderPosition);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateSliderPosition]);

  // Update position when options or value changes
  useLayoutEffect(() => {
    updateSliderPosition();
  }, [options, value, updateSliderPosition]);

  return (
    <div
      className={cn(
        "relative flex w-fit gap-2 rounded-full bg-[#F0F0F0] p-2",
        className,
      )}
    >
      <div
        className="absolute top-2 h-8 rounded-full bg-white transition-all duration-300 ease-in-out"
        style={{
          width: sliderStyle.width,
          left: sliderStyle.left,
        }}
      />
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <button
            ref={(el) => {
              buttonsRef.current[index] = el;
            }}
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative h-8 whitespace-nowrap rounded-full px-4 py-1 text-sm font-medium",
              "transition-colors duration-300 ease-in-out",
              isSelected ? "text-[#5A18BF]" : "text-secondary",
              "hover:text-[#5A18BF]/80",
            )}
          >
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabMotion;

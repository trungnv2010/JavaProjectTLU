import { useState } from "react";

export default function ToggleButton() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div
      className={`w-8 h-5 flex items-center rounded-full p-1 cursor-pointer transition-all ${
        isOn ? "bg-green-500" : "bg-gray-300"
      }`}
      onClick={() => setIsOn(!isOn)}
    >
      <div
        className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-all ${
          isOn ? "translate-x-3" : "translate-x-0"
        }`}
      />
    </div>
  );
}

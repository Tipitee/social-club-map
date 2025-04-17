import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface CityPin {
  id: number;
  name: string;
  x: number;
  y: number;
}

const germanCities: CityPin[] = [
  { id: 1, name: "Berlin", x: 65, y: 32 },
  { id: 2, name: "Munich", x: 58, y: 75 },
  { id: 3, name: "Hamburg", x: 52, y: 20 },
  { id: 4, name: "Cologne", x: 30, y: 45 }
];

const MockMap: React.FC = () => {
  const [activePin, setActivePin] = useState<number | null>(null);

  const handlePinClick = (city: CityPin) => {
    setActivePin(city.id);
    toast(`${city.name} selected - Real club data coming soon!`);
  };

  return (
    <div className="relative w-full aspect-[5/6] bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
      {/* Map image - Using an outline of Germany */}
      <div className="w-full h-full bg-[#1A1F2C] relative">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full absolute inset-0 stroke-gray-500 fill-none"
        >
          <path
            d="M30,20 Q40,15 50,20 Q60,25 70,20 L75,30 Q80,35 75,40 L80,50 Q75,55 80,60 L75,65 Q65,70 70,80 L60,85 Q55,80 50,85 L45,80 Q35,85 30,80 L25,70 Q30,65 25,60 L30,55 Q35,50 30,45 L25,35 Q28,30 30,20 Z"
            className="stroke-2 stroke-gray-600"
            strokeLinejoin="round"
            fill="rgba(50, 60, 90, 0.3)"
          />
        </svg>

        {/* City pins */}
        {germanCities.map((city) => (
          <div
            key={city.id}
            className={`absolute cursor-pointer transition-all duration-300 transform ${
              activePin === city.id ? "scale-125" : "scale-100"
            }`}
            style={{
              left: `${city.x}%`,
              top: `${city.y}%`,
            }}
            onClick={() => handlePinClick(city)}
          >
            <div className="relative">
              <MapPin
                size={activePin === city.id ? 32 : 28}
                className={activePin === city.id ? "text-teal" : "text-secondary"}
                strokeWidth={activePin === city.id ? 3 : 2}
              />
              <div
                className={`absolute whitespace-nowrap px-2 py-1 rounded-md text-xs font-semibold -translate-x-1/2 -translate-y-full left-1/2 top-0 transform ${
                  activePin === city.id
                    ? "bg-teal text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {city.name}
              </div>
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 p-3 rounded-lg">
          <p className="text-center text-sm text-gray-300">
            This is a mock map - Real cannabis club locations coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockMap;

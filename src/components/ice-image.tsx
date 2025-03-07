interface IceImageProps {
  opacity: number;
  size?: number;
}

export default function IceImage({ opacity, size = 200 }: IceImageProps) {
  // Ensure opacity is between 0 and 1
  const safeOpacity = Math.max(0, Math.min(1, opacity));

  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center bg-blue-50"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Use an actual ice image with opacity */}
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          opacity: safeOpacity,
          transition: "opacity 1s ease-in-out",
        }}
      >
        <img
          src="/ice.png"
          alt="氷"
          className="w-4/5 h-4/5 object-contain"
          style={{
            filter: `brightness(${0.8 + safeOpacity * 0.2}) saturate(${
              safeOpacity * 0.5 + 0.5
            })`,
          }}
        />
      </div>

      {/* Ice crystal overlay effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: safeOpacity * 0.7 }}
      >
        <div className="w-full h-full relative">
          {/* Sparkle effects */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-white" />
          <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}

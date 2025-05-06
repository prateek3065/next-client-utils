const getAvailableSide = (
  buttonRect: DOMRect,
  only?: "X" | "Y"
): "left" | "right" | "top" | "bottom" => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate available space for all sides
  const spaces = {
    left: buttonRect.left,
    right: viewportWidth - buttonRect.right,
    top: buttonRect.top,
    bottom: viewportHeight - buttonRect.bottom,
  };

  if (only === "X") {
    // Return the horizontal side with maximum space
    return spaces.left > spaces.right ? "left" : "right";
  }

  if (only === "Y") {
    // Return the vertical side with maximum space
    return spaces.top > spaces.bottom ? "top" : "bottom";
  }

  // Default case: return the side with absolute maximum space
  const [bestSide] = Object.entries(spaces).reduce((max, current) =>
    current[1] > max[1] ? current : max
  );
  return bestSide as "left" | "right" | "top" | "bottom";
};
export default getAvailableSide;

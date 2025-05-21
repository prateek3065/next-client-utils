type LoadingDotsProps = {
  numberOfJumpingBalls?: 1 | 2 | 3;
  ballColor?: "white" | "black";
};

export const LoadingDots: React.FC<LoadingDotsProps> = (props) => {
  const { numberOfJumpingBalls = 3, ballColor = "white" } = props;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: "4px",
    marginTop: "6px",
    justifyContent: "center",
    alignItems: "center",
  };

  const ballStyle: React.CSSProperties = {
    height: "8px",
    width: "8px",
    borderRadius: "50%",
    backgroundColor: ballColor,
    animation: "bounce 0.5s infinite",
  };

  return (
    <div style={containerStyle}>
      {numberOfJumpingBalls >= 1 && (
        <div style={{ ...ballStyle, animationDelay: "0s" }} />
      )}
      {numberOfJumpingBalls >= 2 && (
        <div style={{ ...ballStyle, animationDelay: "0.1s" }} />
      )}
      {numberOfJumpingBalls >= 3 && (
        <div style={{ ...ballStyle, animationDelay: "0.2s" }} />
      )}
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(-100%);
              animation-timing-function: cubic-bezier(0.8,0,1,1);
            }
            50% {
              transform: none;
              animation-timing-function: cubic-bezier(0,0,0.2,1);
            }
          }
        `}
      </style>
    </div>
  );
};

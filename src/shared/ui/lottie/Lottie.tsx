import Lottie from "lottie-react";

const MyLottieComponent = ({
  animationData,
  style,
}: {
  animationData: unknown;
  style: React.CSSProperties;
}) => {
  return <Lottie animationData={animationData} style={style} />;
};

export default MyLottieComponent;

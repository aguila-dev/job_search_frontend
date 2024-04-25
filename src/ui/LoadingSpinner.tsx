interface LoadingSpinnerProps {
  width: string;
  height: string;
}
const LoadingSpinner = ({ width, height }: LoadingSpinnerProps) => {
  return (
    <span
      className={`spinner inline-block ${width} ${height} border-4 border-gray-400 rounded-full border-t-white animate-spin`}
    ></span>
  );
};

export default LoadingSpinner;

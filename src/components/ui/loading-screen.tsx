import React from "react";
import Lottie from "lottie-react";
import loadingAnimationBlue from "@/assets/lottie/loading-blue.json";
import loadingAnimationGreen from "@/assets/lottie/loading-green.json";
import { useAppContext } from "@/provider/useAppContext";

interface LoadingScreenProps {
  style?: React.CSSProperties;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ style }) => {
  const { isLoading, animation } = useAppContext();

  return (
    <>
      {isLoading && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            backgroundColor: "rgba(0,0,0,0.7)",
            ...style,
          }}
          className="w-full h-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-70 z-[99999]">
          <Lottie
            style={{ width: 150, margin: "auto" }}
            animationData={
              animation === "blue"
                ? loadingAnimationBlue
                : loadingAnimationGreen
            }
            loop
            autoPlay
          />
        </div>
      )}
    </>
  );
};

import { useScreenSize } from "@/utils/hooks/use-screen";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function HeroVideo({ className }: { className?: string }) {
  const { lessThenMd } = useScreenSize();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    setVideoSrc(lessThenMd ? "/videos/Hero_video_mobile.mp4" : "/videos/Hero_video.mp4");
  }, [lessThenMd]);

  return (

    <div className={twMerge("flex justify-center mx-auto", className)}>
      {videoSrc && <video
        className="border-4 border-storm-gray rounded-2xl md:rounded-3xl"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src={videoSrc}
      >
        <source src="/videos/Hero_video.mp4" media="(min-width: 768px)" type="video/mp4" />
        <source src="/videos/Hero_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>}
    </div>
  );
}
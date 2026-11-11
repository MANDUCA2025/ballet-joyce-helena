import { useState, type ImgHTMLAttributes } from "react";
import images from "./responsive-images.json";

type ImageInfo = {
  width: number;
  height: number;
  variants: { src: string; width: number }[];
};
const registry: Record<string, ImageInfo> = images;

/** Originals remain the fallback; derived files preserve aspect ratio and authorization. */
export function ResponsiveImage({
  src = "",
  sizes = "(min-width: 900px) 45vw, 100vw",
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const image = registry[src];
  const responsive = image?.variants.length && failedSource !== src;
  return (
    <img
      width={image?.width}
      height={image?.height}
      decoding="async"
      {...props}
      src={src}
      srcSet={
        responsive
          ? image.variants.map((v) => `${v.src} ${v.width}w`).join(", ")
          : undefined
      }
      sizes={responsive ? sizes : undefined}
      onError={(event) => {
        if (responsive) setFailedSource(src);
        else onError?.(event);
      }}
    />
  );
}

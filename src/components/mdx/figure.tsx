/* eslint-disable @next/next/no-img-element */
export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <img src={src} alt={alt} className="rounded-lg border border-line" />
      {caption ? (
        <figcaption className="mt-2 text-center font-mono text-xs text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

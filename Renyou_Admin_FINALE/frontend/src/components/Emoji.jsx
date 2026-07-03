import twemoji from "twemoji";

export default function Emoji({ children, className = "" }) {
  const html = twemoji.parse(children || "", {
    folder: "svg",
    ext: ".svg",
  });

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
// Inline, render-blocking script that applies the persisted (or system) theme
// before first paint to avoid a flash of the wrong theme on a static site.
export function ThemeScript() {
  const code = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

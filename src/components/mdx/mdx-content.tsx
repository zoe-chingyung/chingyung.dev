import * as runtime from "react/jsx-runtime";
import { Callout } from "./callout";
import { Figure } from "./figure";

const sharedComponents = { Callout, Figure };

function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return (
    <div className="article">
      <Component components={sharedComponents} />
    </div>
  );
}

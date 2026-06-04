import { jsonLdScript } from "@/lib/seo/json-ld";

type JsonLdScriptProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLdScript(data)}
    />
  );
}

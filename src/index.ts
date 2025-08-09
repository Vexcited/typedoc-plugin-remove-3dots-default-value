import {
  type Application,
  ContainerReflection,
  DeclarationReflection,
  Reflection,
  ReflectionKind,
  SignatureReflection
} from "typedoc";

export function load(app: Application): void {
  app.renderer.on("beginPage", (page) => {
    if (page.model instanceof Reflection) {
      stripDefaults(page.model);
    }
  });

  app.converter.on("resolveEnd", (context) => {
    stripDefaults(context.project);
  });
}

function stripDefaults(reflection: Reflection): void {
  if (!reflection) return;

  if (
    reflection.kindOf(ReflectionKind.Property)
    && reflection instanceof DeclarationReflection
    && reflection.defaultValue === "..."
  ) {
    delete reflection.defaultValue;
  }

  if (reflection instanceof ContainerReflection && reflection.children) {
    for (const child of reflection.children) {
      stripDefaults(child);
    }
  }

  if (reflection instanceof DeclarationReflection && reflection.signatures) {
    for (const sig of reflection.signatures) {
      stripDefaults(sig);
    }
  }

  if (reflection instanceof SignatureReflection && reflection.parameters) {
    for (const param of reflection.parameters) {
      stripDefaults(param);
    }
  }
}

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";

export interface AiAutocompleteOptions {
  enabled: boolean;
  debounceMs: number;
  fetchSuggestion: (context: string) => Promise<string>;
}

interface PluginState {
  suggestion: string;
  decorations: DecorationSet;
  loading: boolean;
}

const pluginKey = new PluginKey<PluginState>("aiAutocomplete");

function getTextContext(doc: { textBetween: (from: number, to: number, blockSep?: string, leafText?: string) => string }, pos: number) {
  const start = Math.max(0, pos - 1200);
  return doc.textBetween(start, pos, "\n", " ");
}

export const AiAutocompleteExtension = Extension.create<AiAutocompleteOptions>({
  name: "aiAutocomplete",

  addOptions() {
    return {
      enabled: true,
      debounceMs: 650,
      fetchSuggestion: async () => "",
    };
  },

  addProseMirrorPlugins() {
    const extension = this;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let requestId = 0;

    const clearDebounce = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    };

    const scheduleFetch = (view: EditorView) => {
      clearDebounce();
      if (!extension.options.enabled) return;

      debounceTimer = setTimeout(() => {
        const { state } = view;
        const { from, empty } = state.selection;
        if (!empty) return;

        const context = getTextContext(state.doc, from).trim();
        if (context.length < 3) return;

        const currentRequest = ++requestId;

        void extension.options.fetchSuggestion(context).then((suggestion) => {
          if (currentRequest !== requestId) return;
          const trimmed = suggestion.trim();
          if (!trimmed) return;

          const { state: latestState } = view;
          const { from: latestFrom, empty: latestEmpty } = latestState.selection;
          if (!latestEmpty || latestFrom !== from) return;

          const tr = latestState.tr.setMeta(pluginKey, {
            type: "setSuggestion",
            suggestion: trimmed,
            pos: latestFrom,
          });
          view.dispatch(tr);
        });
      }, extension.options.debounceMs);
    };

    return [
      new Plugin<PluginState>({
        key: pluginKey,
        state: {
          init() {
            return {
              suggestion: "",
              decorations: DecorationSet.empty,
              loading: false,
            };
          },
          apply(tr, value, _oldState, newState) {
            const meta = tr.getMeta(pluginKey) as
              | { type: "setSuggestion"; suggestion: string; pos: number }
              | { type: "clear" }
              | undefined;

            if (meta?.type === "clear") {
              return {
                suggestion: "",
                decorations: DecorationSet.empty,
                loading: false,
              };
            }

            if (meta?.type === "setSuggestion" && meta.suggestion) {
              const widget = Decoration.widget(
                meta.pos,
                () => {
                  const span = document.createElement("span");
                  span.className = "ai-ghost-suggestion";
                  span.textContent = meta.suggestion;
                  span.setAttribute("aria-hidden", "true");
                  span.setAttribute("contenteditable", "false");
                  return span;
                },
                { side: 1, key: `ai-${meta.suggestion}` },
              );

              return {
                suggestion: meta.suggestion,
                decorations: DecorationSet.create(newState.doc, [widget]),
                loading: false,
              };
            }

            if (tr.docChanged || tr.selectionSet) {
              return {
                suggestion: "",
                decorations: DecorationSet.empty,
                loading: false,
              };
            }

            return value;
          },
        },
        props: {
          decorations(state) {
            return pluginKey.getState(state)?.decorations ?? DecorationSet.empty;
          },
          handleKeyDown(view, event) {
            if (!extension.options.enabled) return false;

            const pluginState = pluginKey.getState(view.state);
            const suggestion = pluginState?.suggestion ?? "";

            if (event.key === "Tab" && suggestion) {
              event.preventDefault();
              const { from } = view.state.selection;
              view.dispatch(
                view.state.tr
                  .insertText(suggestion, from)
                  .setMeta(pluginKey, { type: "clear" }),
              );
              requestId += 1;
              clearDebounce();
              return true;
            }

            if (event.key === "Escape" && suggestion) {
              event.preventDefault();
              view.dispatch(view.state.tr.setMeta(pluginKey, { type: "clear" }));
              requestId += 1;
              clearDebounce();
              return true;
            }

            return false;
          },
        },
        view(view) {
          const handleUpdate = () => scheduleFetch(view);
          return {
            update(view, prevState) {
              if (
                view.state.doc !== prevState.doc ||
                view.state.selection !== prevState.selection
              ) {
                handleUpdate();
              }
            },
            destroy() {
              clearDebounce();
            },
          };
        },
      }),
    ];
  },
});

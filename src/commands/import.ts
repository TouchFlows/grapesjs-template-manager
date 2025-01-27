import { Editor, PluginOptions } from 'grapesjs';

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const cmdm = editor.Commands;
  // @ts-ignore
  const pfx = editor.getConfig().stylePrefix;

  cmdm.add('open-import', {
    createCodeViewer(): any {
      // @ts-ignore
      return editor.CodeManager.createViewer({
        codeName: 'htmlmixed',
        theme: "hopscotch",
        readOnly: false,
      });
    },

    createCodeEditor() {
      const el = document.createElement('div');
      const codeEditor = this.createCodeViewer();

      el.style.flex = '1 0 auto';
      el.style.boxSizing = 'border-box';
      el.className = `${pfx}import-code`;
      el.appendChild(codeEditor.getElement());

      return { codeEditor, el };
    },

    getCodeContainer(): HTMLDivElement {
      // @ts-ignore
      let containerEl = this.containerEl as HTMLDivElement;

      if (!containerEl) {
        containerEl = document.createElement('div');
        containerEl.className = `${pfx}import-container`;
        containerEl.style.display = 'flex';
        containerEl.style.gap = '5px';
        containerEl.style.flexDirection = 'column';
        containerEl.style.justifyContent = 'space-between';
        // @ts-ignore
        this.containerEl = containerEl;
      }

      return containerEl;
    },

    run(editor) {
      const container = this.getCodeContainer();
      let { codeEditorHtml } = this as any;

      // Init code viewer if not yet instantiated
      if (!codeEditorHtml) {
        const codeViewer = this.createCodeEditor();
        const btnImp = document.createElement("button");
        codeEditorHtml = codeViewer.codeEditor;
        // @ts-ignore
        this.codeEditorHtml = codeEditorHtml;

        if(opts.modalLabelImport){
          let labelEl = document.createElement('div');
          labelEl.className = `${pfx}import-label`;
          labelEl.innerHTML = opts.modalLabelImport;
          container.appendChild(labelEl);
        }

        // Init import button
        btnImp.innerHTML = opts.modalBtnImport;
        btnImp.className = `${pfx}btn-prim ${pfx}btn-import`;
        btnImp.style.alignSelf = 'flex-start';
        btnImp.onclick = () => {
          const code = codeViewer.codeEditor.editor.getValue();
          editor.Components.clear();
          editor.Css.clear();
          editor.setComponents(code);
          editor.Modal.close();
        };

        container.appendChild(codeViewer.el);
        container.appendChild(btnImp);
      }

      editor.Modal.open({
        title: opts.modalTitleImport,
        content: container,
      });

      if (codeEditorHtml) {
        codeEditorHtml.setContent(opts.importPlaceholder || '');
        codeEditorHtml.editor.refresh();
      }
    },
  });
};
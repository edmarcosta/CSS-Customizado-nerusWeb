(function() {
    // Array para armazenar as classes de seleção de cada tabela
    let tableSelectionClasses = [];
    let modalSelectionClass = '';
  
    // Função para extrair a última classe de uma linha
    function getLastClass(row) {
      if (!row) return '';
      const classes = row.className.split(/\s+/).filter(cls => cls.length > 0);
      console.log(`🔍 Classes da linha: ${classes.join(', ')}`);
      return classes.length >= 1 ? classes[classes.length - 1] : '';
    }
  
    // Função para atualizar as classes de seleção de todas as tabelas
    function updateTableSelectionClasses() {
      tableSelectionClasses = [];
      const tables = document.querySelectorAll('table');
      tables.forEach((table, index) => {
        const rows = table.querySelectorAll('tbody tr');
        let selectionClass = '';
        rows.forEach(row => {
          const classes = row.className.split(/\s+/).filter(cls => cls.length > 0);
          // Assume que a classe de seleção é a última classe de uma linha com mais classes que o padrão
          if (classes.length > 3) { // Ajuste conforme o número base de classes
            selectionClass = classes[classes.length - 1];
          }
        });
        if (selectionClass) {
          tableSelectionClasses.push({ table, selectionClass });
          console.log(`✅ Classe de seleção da tabela ${index + 1}: ${selectionClass}`);
        }
      });
    }
  
    // Função para atualizar a classe de seleção da tabela do modal
    function updateModalSelectionClass() {
      const modalTable = document.querySelector('[class*="MuiDialog-root"] table');
      if (modalTable) {
        const rows = modalTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const classes = row.className.split(/\s+/).filter(cls => cls.length > 0);
          if (classes.length > 4) { // Ajuste para o modal (4 classes + seleção)
            modalSelectionClass = classes[classes.length - 1];
            console.log(`✅ Classe de seleção do modal: ${modalSelectionClass}`);
          }
        });
      }
    }
  
    // Função para injetar o CSS
    function injectCSS() {
      const style = document.createElement('style');
      let css = `
        /* Estilo para AppBar */
        .MuiAppBar-colorPrimary {
          color: #FFFFFF !important;
          background-color: #0e255e !important;
        }
      `;
  
      // Adiciona CSS para cada tabela
      tableSelectionClasses.forEach(({ selectionClass }, index) => {
        css += `
          /* Efeito para a linha selecionada na tabela ${index + 1} */
          table:nth-of-type(${index + 1}) tbody tr.${selectionClass} {
            background-color: #6ed1ff !important;
            font-weight: bold !important;
            font-size: 1.1em !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
          }
  
		 /* Remove qualquer background inline de qualquer célula */
		 table td[style*="background-color"] {
		 background-color: transparent !important;
		 }

          /* Sobrescreve estilos inline nas células da tabela ${index + 1} */
          table:nth-of-type(${index + 1}) tbody tr.${selectionClass} td {
            background-color: transparent !important;
            color: #000000 !important;
          }
        `;
      });
  
      // Adiciona CSS para a tabela do modal
      if (modalSelectionClass) {
        css += `
          /* Efeito para a linha selecionada no modal */
          [class*="MuiDialog-root"] table tbody tr.${modalSelectionClass} {
            background-color: #6ed1ff !important;
            font-weight: bold !important;
            font-size: 1.1em !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
          }
		  
		 /* Remove qualquer background inline de qualquer célula */
		 table td[style*="background-color"] {
		 background-color: transparent !important;
		 }  
		 
          /* Sobrescreve estilos inline nas células do modal */
          [class*="MuiDialog-root"] table tbody tr.${modalSelectionClass} td {
            background-color: transparent !important;
            color: #000000 !important;
          }
        `;
      }
  
      style.textContent = css;
      document.head.appendChild(style);
      console.log("✅ CSS customizado injetado: AppBar e tabelas estilizadas");
    }
  
    // Inicializa as tabelas
    setTimeout(() => {
      updateTableSelectionClasses();
      updateModalSelectionClass();
      injectCSS();
  
      // Observa mudanças no DOM para detectar o modal e mudanças nas classes
      const observer = new MutationObserver((mutations) => {
        let modalDetected = false;
        let classChanged = false;
  
        mutations.forEach(mutation => {
          // Detecta abertura do modal
          if (mutation.addedNodes.length) {
            const modal = document.querySelector('[class*="MuiDialog-root"]');
            if (modal && modal.querySelector('table')) {
              modalDetected = true;
              console.log('🔄 Modal com tabela detectado.');
            }
          }
          // Detecta mudanças nas classes das linhas
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target;
            if (target.tagName === 'TR' && target.parentElement.tagName === 'TBODY') {
              classChanged = true;
              console.log(`🔄 Mudança de classe detectada na linha: ${target.className}`);
            }
          }
        });
  
        if (modalDetected || classChanged) {
          updateTableSelectionClasses();
          updateModalSelectionClass();
          injectCSS();
        }
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
      console.log("✅ Observador de modal e classes configurado.");
    }, 500);
  })();
// Preencher a data atual quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    document.getElementById('data').value = `${year}-${month}-${day}`;
});

// Máscara para o campo de telefone
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length <= 11) {
        if (value.length > 2) {
            formattedValue += '(' + value.substring(0, 2) + ') ';
            if (value.length > 7) {
                formattedValue += value.substring(2, 7) + '-' + value.substring(7);
            } else {
                formattedValue += value.substring(2);
            }
        } else {
            formattedValue = value;
        }
    } else {
        formattedValue = value.substring(0, 11);
    }
    
    e.target.value = formattedValue;
});

// Função para formatar a data para o formato brasileiro
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Função para gerar PDF
function gerarPDF() {
    const element = document.getElementById('printArea');
    const empresa = document.getElementById('empresa').value || 'Empresa';
    const data = formatarData(document.getElementById('data').value);
    const passageiro = document.getElementById('passageiro').value;
    
    // Configurar opções do PDF
    const opt = {
        margin: [5, 5, 5, 5],
        filename: `OS_Transporte_${empresa}_${passageiro}_${data}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 1,
            useCORS: true,
            logging: false,
            letterRendering: true,
            windowWidth: 800,
            windowHeight: 1132, // Altura A4 em pixels
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { mode: 'avoid-all' }
    };

    // Remover margens temporariamente para geração do PDF
    const originalStyle = element.style.cssText;
    element.style.padding = '5mm';

    // Gerar PDF
    html2pdf().set(opt).from(element).save().then(() => {
        // Restaurar estilo original
        element.style.cssText = originalStyle;
    });
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('transportForm').reset();
    document.getElementById('empresa').value = '';
    
    // Resetar a data para a data atual
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    document.getElementById('data').value = `${year}-${month}-${day}`;
}

// Validar campos numéricos para não aceitar valores negativos
document.getElementById('numPessoas').addEventListener('input', function() {
    if (this.value < 1) this.value = 1;
});

document.getElementById('numMalas').addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
}); 
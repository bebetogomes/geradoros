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

// Função para preparar o conteúdo para impressão
function prepararConteudo() {
    const printArea = document.getElementById('printArea');
    const clone = printArea.cloneNode(true);
    
    // Converter inputs e selects para texto
    clone.querySelectorAll('input, select, textarea').forEach(element => {
        if (element.type === 'date') {
            const dataFormatada = formatarData(element.value);
            element.parentNode.innerHTML = element.parentNode.innerHTML.replace(element.outerHTML, dataFormatada);
        } else {
            element.parentNode.innerHTML = element.parentNode.innerHTML.replace(element.outerHTML, element.value);
        }
    });

    return clone;
}

// Função para fazer o download da Ordem de Serviço
function downloadOS() {
    // Verificar se todos os campos obrigatórios estão preenchidos
    const form = document.getElementById('transportForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let todosPreenchidos = true;

    inputs.forEach(input => {
        if (!input.value) {
            todosPreenchidos = false;
            input.classList.add('campo-erro');
        } else {
            input.classList.remove('campo-erro');
        }
    });

    if (!todosPreenchidos) {
        alert('Por favor, preencha todos os campos obrigatórios antes de fazer o download.');
        return;
    }

    // Preparar o conteúdo para o PDF
    const conteudoImpressao = prepararConteudo();
    const empresa = document.getElementById('empresa').value || 'Empresa';
    const data = formatarData(document.getElementById('data').value);
    const passageiro = document.getElementById('passageiro').value;

    // Configurações do PDF
    const opt = {
        margin: 10,
        filename: `OS_Transporte_${empresa}_${passageiro}_${data}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: true,
            foreignObjectRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true,
            precision: 16
        }
    };

    // Adicionar estilos específicos para o PDF
    const styleTemp = document.createElement('style');
    styleTemp.textContent = `
        #printArea { padding: 20px !important; }
        .form-section { margin-bottom: 15px !important; }
        input, select, textarea { border: none !important; }
    `;
    conteudoImpressao.appendChild(styleTemp);

    // Criar um container temporário
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(conteudoImpressao);
    document.body.appendChild(tempContainer);

    // Gerar e fazer download do PDF
    html2pdf()
        .set(opt)
        .from(tempContainer)
        .save()
        .then(() => {
            // Limpar o container temporário
            document.body.removeChild(tempContainer);
        })
        .catch(err => {
            console.error('Erro ao gerar PDF:', err);
            alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
            document.body.removeChild(tempContainer);
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

    // Remover classes de erro
    const inputs = document.querySelectorAll('.campo-erro');
    inputs.forEach(input => input.classList.remove('campo-erro'));
}

// Validar campos numéricos para não aceitar valores negativos
document.getElementById('numPessoas').addEventListener('input', function() {
    if (this.value < 1) this.value = 1;
});

document.getElementById('numMalas').addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
}); 
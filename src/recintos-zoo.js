class RecintosZoo {
    constructor() {
        this.recintos = this.definirRecintos();
        this.animais = this.definirAnimais();
    }

    definirRecintos() {
        return [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];
    }

    definirAnimais() {
        return {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio', 'savana e rio'], carnivoro: false }
        };
    }

    analisaRecintos(especie, quantidade) {
        const animal = this.validarAnimal(especie);
        if (!animal) {
            return { erro: "Animal inválido" };
        }

        if (!this.validarQuantidade(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const recintosViaveis = this.obterRecintosViaveis(animal, quantidade, especie);

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return this.formatarRecintosViaveis(recintosViaveis, animal, quantidade, especie);
    }

    validarAnimal(especie) {
        return this.animais[especie.toUpperCase()];
    }

    validarQuantidade(quantidade) {
        return quantidade > 0 && Number.isInteger(quantidade);
    }

    obterRecintosViaveis(animal, quantidade, especie) {
        return this.recintos.filter(recinto => {
            if (!this.biomaAdequado(recinto.bioma, animal.biomas)) {
                return false;
            }

            const espacoOcupado = recinto.animais.reduce((total, a) => total + a.quantidade * this.animais[a.especie.toUpperCase()].tamanho, 0);
            const espacoNecessario = quantidade * animal.tamanho + (recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === especie) ? 1 : 0);
            if (recinto.tamanho - espacoOcupado < espacoNecessario) {
                return false;
            }

            if (animal.carnivoro && recinto.animais.length > 0 &&
                !recinto.animais.every(animalPresente => this.animais[animalPresente.especie.toUpperCase()].carnivoro)) {
                return false;
            }

            if (especie.toUpperCase() === 'HIPOPOTAMO' && recinto.animais.length > 0 && recinto.bioma !== 'savana e rio') {
                return false;
            }

            if (especie.toUpperCase() === 'MACACO' && recinto.animais.length === 0 && quantidade === 1) {
                return false;
            }

            if (recinto.animais.length > 0) {
                for (const animalPresente of recinto.animais) {
                    const infoAnimalPresente = this.animais[animalPresente.especie.toUpperCase()];
                    if (infoAnimalPresente.carnivoro && especie.toUpperCase() !== animalPresente.especie.toUpperCase()) {
                        return false;
                    }
                    if (animalPresente.especie.toUpperCase() === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
                        return false;
                    }
                }
            }

            return true;
        }).sort((a, b) => a.numero - b.numero);
    }

    biomaAdequado(biomaRecinto, biomasAnimal) {
        return biomasAnimal.includes(biomaRecinto) || biomaRecinto === 'savana e rio';
    }

    formatarRecintosViaveis(recintosViaveis, animal, quantidade, especie) {
        return {
            recintosViaveis: recintosViaveis.map(recinto => {
                const totalOcupado = recinto.animais.reduce((soma, a) => soma + (a.quantidade * this.animais[a.especie.toUpperCase()].tamanho), 0);
                let espacoLivre = recinto.tamanho - totalOcupado;
                espacoLivre -= quantidade * animal.tamanho;
                if (recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === especie)) {
                    espacoLivre -= 1;
                }
                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
            })
        };
    }

}

export { RecintosZoo as RecintosZoo };
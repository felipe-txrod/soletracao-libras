# Desafio de soletração em Libras

Aplicação web para praticar a leitura de palavras e nomes soletrados com o alfabeto manual da Língua Brasileira de Sinais (Libras). O site apresenta uma fotografia por letra, em sequência, para que a pessoa tente identificar a palavra.

**[Acessar o projeto](https://felipe-txrod.github.io/soletracao-libras/)**

O foco é a soletração pelo alfabeto manual (datilologia). As sequências de letras não representam os sinais próprios das palavras em Libras.

## Como usar

### Modo desafio

1. Escolha um tema e clique em **Sortear palavra**. A sequência de letras começa automaticamente.
2. Observe as fotografias e digite a palavra no campo de resposta.
3. Clique em **Conferir** ou pressione `Enter` para verificar sua tentativa.
4. Use **Ver dica** para consultar o significado sem revelar a palavra, ou **Mostrar resposta** para exibir a palavra e sua definição.

O catálogo contém **100 palavras, nomes e termos**, distribuídos em cinco temas com 20 entradas cada: **Geral, Nomes, Saúde, Ciências e Turismo**.

O sorteio percorre todas as entradas de um tema antes de iniciar um novo ciclo, sem repetir a última palavra do ciclo anterior imediatamente. Esse controle fica apenas na memória da página e é reiniciado ao recarregá-la.

### Soletração livre

Na aba **Soletração livre**, digite uma palavra ou nome de até 45 caracteres e clique em **Mostrar soletração** ou pressione `Enter`. Nesse modo, a letra correspondente também aparece junto à fotografia. Quando o texto coincide com um termo do catálogo, sua definição é exibida.

### Reprodução e consulta

- **Velocidade:** 0,5x, 1x ou 2x.
- **Pausar/Continuar:** interrompe e retoma a sequência.
- **Repetir:** reproduz a sequência desde o início.
- **Próxima letra:** permite acompanhar a soletração manualmente.
- **Consultar o alfabeto manual:** abre a galeria de A a Z; selecionar uma letra a exibe no modo livre.

Acentos são removidos para a exibição das letras, incluindo a conversão de `ç` em `C`. Espaços e hífens separam palavras com uma pausa adicional na reprodução. A conferência de respostas ignora maiúsculas, minúsculas, acentos, espaços e hífens.

## Executar localmente

O projeto usa **HTML, CSS e JavaScript**, sem frameworks, dependências externas ou etapa de compilação. Todos os arquivos necessários ao exercício, incluindo as fotografias, estão no repositório.

Clone o repositório:

```bash
git clone https://github.com/felipe-txrod/soletracao-libras.git
cd soletracao-libras
```

Abra `index.html` no navegador. Também é possível servir a pasta com Python 3:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Acesse <http://127.0.0.1:8000> e use `Ctrl+C` para encerrar o servidor. Depois de baixar os arquivos, a aplicação pode ser usada sem conexão com a internet.

## Organização do projeto

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura da página, modos de exercício e controles. |
| `estilo.css` | Estilos e adaptação do layout a diferentes tamanhos de tela. |
| `dados.js` | Catálogo de temas, palavras e definições. |
| `app.js` | Sorteio, reprodução das letras, modos de uso e conferência das respostas. |
| `imagens/` | As 26 fotografias do alfabeto manual, de `A.jpg` a `Z.jpg`. |
| `.github/workflows/pages.yml` | Publicação automática no GitHub Pages. |
| `LICENSE` | Texto da licença GPL-3.0. |

Para alterar o catálogo, edite `dados.js`, preservando a estrutura de `CATEGORIAS` e os campos `palavra` e `definicao`. Se mudar a quantidade de temas ou termos, atualize também os textos correspondentes em `index.html` e neste README.

## Publicação

O projeto está hospedado no **GitHub Pages**. O fluxo **Deploy to GitHub Pages**, definido em `.github/workflows/pages.yml`, publica os arquivos estáticos a cada envio para a branch `main`. Ele também pode ser executado manualmente pela aba **Actions** do repositório.

As execuções e seus resultados ficam disponíveis em [GitHub Actions](https://github.com/felipe-txrod/soletracao-libras/actions/workflows/pages.yml).

## Créditos e licença

As fotografias do alfabeto manual são creditadas ao projeto [RoboLibras](https://github.com/ianderichalski/robo-libras/tree/main/docs/alphabet), indicado como fonte no material original desta adaptação e disponibilizado sob [GPL-3.0](https://github.com/ianderichalski/robo-libras/blob/main/LICENSE). O texto da licença acompanha este repositório em [LICENSE](LICENSE).

As imagens mostram configurações estáticas das mãos. Uma fotografia isolada não representa todos os movimentos necessários para sinalizar determinadas letras; o uso do site deve ser complementado com demonstrações em movimento e orientação de quem conhece Libras.

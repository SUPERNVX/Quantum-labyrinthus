# Quantum Labyrinthus

Uma simulação visual interativa que demonstra a diferença fundamental entre algoritmos de resolução de labirintos clássicos e inspirados em computação quântica.

Este projeto serve como uma ferramenta educacional para visualizar o conceito de superposição e paralelismo quântico de uma forma simples e tangível.

![Screenshot da Aplicação](Screenshot%202025-11-03%20175820.png)

---

## 🚀 Funcionalidades

*   **Visualização Comparativa:** Assista a um algoritmo clássico (Busca em Profundidade - DFS) e um algoritmo de inspiração quântica (Busca em Largura - BFS) resolverem labirintos idênticos lado a lado.
*   **Múltiplos Tamanhos de Labirinto:** Alterne entre labirintos de diferentes tamanhos para observar como a complexidade afeta a eficiência de cada abordagem.
*   **Modo Contínuo:** Deixe os algoritmos resolverem labirintos gerados aleatoriamente em sequência para coletar estatísticas de desempenho.
*   **Estatísticas em Tempo Real:** Um placar exibe o número de labirintos resolvidos, o tempo médio de solução e a diferença de velocidade entre os dois computadores.
*   **Geração de Labirinto Avançada:** Os labirintos são gerados com conexões extras para criar múltiplos caminhos, destacando a vantagem do paralelismo quântico.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Estilização:** Tailwind CSS
*   **Computação Paralela (Simulada):** Web Workers para o solver quântico.
*   **Renderização:** HTML5 Canvas para uma animação de alta performance.

## ⚙️ Como Executar Localmente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/Quantum-labyrinthus.git
    cd Quantum-labyrinthus
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

    A aplicação estará disponível em `http://localhost:5173` (ou em outra porta, se a 5173 estiver em uso).

## 📦 Deploy

O projeto está configurado para deploy no GitHub Pages.

1.  **Faça o build do projeto:**
    ```bash
    npm run build
    ```

2.  O conteúdo da pasta `dist` é o que deve ser servido pelo GitHub Pages.

**Importante:** O arquivo `vite.config.ts` está configurado com `base: '/Quantum-labyrinthus/'`. Se o nome do seu repositório for diferente, ajuste este valor antes de fazer o build.

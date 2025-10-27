# E o Tempo?

Aplicação web para consulta de previsão do tempo, com foco em alta performance, código limpo e experiência do usuário (UX).

Acesse a versão em produção: **[https://sebastiaoarmdev.github.io/eotempo/](https://sebastiaoarmdev.github.io/eotempo/)**

-----

## Stack de Tecnologia

Este projeto foi desenvolvido utilizando as seguintes tecnologias e ferramentas:

* **Linguagem Principal**: JavaScript (ES6 Modules).
* **Estilização**: Tailwind CSS.
* **API de Dados**: HG Brasil Weather API.
* **Arquitetura**:	PWA (Service Worker, Manifest).

## Destaques de Engenharia e Performance

O projeto **"E o Tempo?"** foi arquitetado seguindo as melhores práticas de engenharia de software para garantir escalabilidade, manutenibilidade e uma experiência de usuário (UX) superior:

### 1\. Arquitetura Modular (Single Responsibility Principle - SRP)

Todo o código JavaScript é estruturado em módulos ES6, garantindo a separação clara de responsabilidades:

  * `main.js`: Orquestrador da aplicação.
  * `api.js`: Gerencia a comunicação e as URLs da API.
  * `cache.js`: Lógica de cache inteligente (`localStorage`).
  * `dom.js`: Exclusivo para manipulação e renderização da interface (DOM).
  * `weather.js`: Funções puras de cálculo científico (ex.: sensação térmica).
  * `utils.js`: Funções de utilidade genéricas (ex.: formatação de tempo).

### 2\. Performance Otimizada

  * **Cache Estratégico:** Utiliza `localStorage` para armazenar resultados, evitando requisições desnecessárias à API e melhorando a velocidade de carregamento em visitas repetidas.
  * **Manipulação de DOM Eficiente:** Otimização de renderização no `dom.js` com uso de **`DocumentFragment`** para minimizar o *reflow* e *repaint*, garantindo transições de tela rápidas.
  * **Prevenção de CLS:** As imagens têm atributos `width` e `height` definidos no HTML para evitar o *Cumulative Layout Shift* (CLS).

### 3\. UX e Acessibilidade (A11y)

  * **Acessibilidade (A11y):** Todas as imagens de condição do tempo possuem atributos `alt` descritivos.
  * **Design Responsivo:** Layout adaptativo para dispositivos móveis e desktop, com chips de navegação que se ajustam ao tamanho da tela.
  * **SEO:** O título da página (`<title>`) é atualizado dinamicamente pelo JavaScript com o nome da cidade, melhorando a experiência e o SEO.

### 4\. Progressive Web App (PWA)

O projeto pode ser instalado como um aplicativo nativo no celular ou desktop, oferecendo uma experiência offline-first e app-like:

  * **Instalável**: Definido via manifest.json.
  * **Offline-First**: O Service Worker intercepta requisições, garantindo que o App Shell (HTML, CSS, JS) seja carregado mesmo sem conexão.

## Contribuição

Contribuições são bem-vindas\! Se você tiver sugestões para otimização ou novos recursos, sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request*.

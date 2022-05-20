# Desafio Softruck

Neste desafio, a tarefa era criar uma tela com um mapa mostrando a animação do sprite de um carro percorrendo trajetos fornecidos por dados geográficos.

## Instruções de execução

Com o Node.JS instalado, para executar a aplicação, navegue até a pasta raiz do repositório e execute no terminal o comando abaixo para instalar as dependências:

`npm install`

Após instalar as dependências, execute o comando abaixo para rodar a aplicação no localhost em ambiente de de desenvolvimento:

`npm run dev`

## Tecnologias utilizadas

Para a realização do desafio, optou-se por utilizar o ReactJS, um framework de JavaScript/TypeScript para interfaces de usuário, pois ele auxilia a construirmos aplicações de página única de forma eficiente. O TypeScript foi escolhido para ser usado nessa aplicação, pois dá um melhor controle sobre os que as variáveis estão recebendo.

Para gerar o projeto React, foi utilizado o Vite, que demonstrou ser mais rápido para gerar aplicações React, pelas experiências anteriores que eu obtive nas configurações do meu computador pessoal.

Já dentro do React, utilizou-se também uma biblioteca de JavaScript chamada Mapbox GL JS, que se mostrou muito útil para adicionar mapas em aplicações web/front-end. Com o Mapbox, foi possível armazenar longitude e latitude nos estados do React e atualizar esses dados para serem mostrados no mapa, além de também poder manipular o zoom, adicionar marcadores, linhas e sprites no mapa.

Para a estilização, foi utilizado o SASS, um pré-processador de CSS que nos permite escrever estilos em cascata além de outras vantagens.

Para auxiliar na implementação da animação do sprite, foi utilizada uma biblioteca JavaScript chamada Turf. Essa biblioteca é comumente usada no contexto de aplicações com componentes geoespaciais, contendo funções e módulos com algoritmos muito interessantes, como por exemplo calcular distância entre dois pontos (length) e calcular o ângulo entre dois pontos (bearing), algumas das funções utilizadas no desafio. O principal uso do Turf foi para realizar uma animação mais "suave".

Além disso, o Turf já usa dentro de suas dependências um formato de armazenamento de recursos geográficos chamado GeoJSON, que também é utilizado pelo Mapbox para adicionar sources e camadas no mapa instanciado.

## Código

O maioria do código relacionado ao mapa está dentro do App.tsx na pasta src, enquanto a sidebar mostrando longitude, latitude e zoom atuais foi colocada num componente separado na pasta src/components, o que também foi feito com o botão de replay da animação. No App.tsx, o mapa é declarado, os valores do estados são atualizados sempre que o mapa é movido pelo mouse, e é feita a lógica da animação do sprite. As tarefas bônus não foram realizadas.

Na pasta src/assets estão os arquivos PNG de sprite do carro. A forma que encontrei de realizar a animação não dependia de todas as rotações do carro num PNG só, então tomei a liberdade de fazer um PNG separado com uma posição fixa e utilizar este PNG.

Na raiz do projeto, encontra-se o arquivo JSON fornecido. Por algum motivo, que provavelmente passou despercebido durante o desenvolvimento, eu não estava conseguindo realizar o fetch do arquivo JSON de forma correta. Os valores estavam todos sendo recebidos como undefined. Devido a isso, optei por fazer um hardcode das coordenadas de um dos trajetos, para verificar se funcionaria de fato. A aplicação está realizando a animação de apenas um trajeto, que é o primeiro trajeto apresentado no array "courses" do arquivo JSON (Rua Alvaro Leão Camelo, Guarujá, SP).

No arquivo App.tsx, alguns erros relacionados ao TypeScript estão sendo apontados, mas a aplicação está rodando corretamente. Pesquisando os erros, pensou-se que poderia ter algo a ver com os tipos utilizados pelo GeoJSON, levando a adicionar o @types/geojson no projeto, o que não resolveu os erros. Sem ter certeza de como resolver, optei por deixar os erros no arquivo.

Para a realização deste desafio, foi imprescindível a pesquisa na documentação do Mapbox, que era a principal biblioteca sendo utilizada na aplicação, além de pesquisar sobre as outras bibliotecas e sobre erros que apareceram durante o desenvolvimento.

## Referências

Referências utilizadas para o desenvolvimento do desafio:

- https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
- https://docs.mapbox.com/mapbox-gl-js/example/animate-marker/
- https://docs.mapbox.com/mapbox-gl-js/example/geojson-line/
- https://docs.mapbox.com/mapbox-gl-js/example/animate-point-along-route/
- https://localcoder.org/animate-multiple-point-along-routes-using-mapbox-gl-js
- https://stackoverflow.com/questions/56152019/how-to-fix-type-error-when-drawing-a-line-with-mapbox
- https://stackoverflow.com/questions/53747059/animate-an-icon-by-using-serious-of-lat-lon-array-mapbox-js
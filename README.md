# O Cofre

Jogo web interativo de adivinhação de senha em estilo de cofre, desenvolvido como atividade acadêmica.

## Descrição

O projeto simula um cofre com mecanismo de segurança em que o jogador precisa descobrir a combinação secreta antes que o tempo acabe ou que as tentativas se esgotem. O jogo apresenta:

- tela inicial com regras do desafio
- cronômetro de 1 minuto e 30 segundos
- limite de 7 tentativas
- dicas de maior/menor conforme a tentativa
- roldanas animadas simulando a combinação do cofre
- histórico de tentativas anteriores
- sons e visual temático de segurança

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- Imagens e áudio para ambientação

## Estrutura do projeto

- `index.html` — estrutura principal da interface
- `css/style.css` — estilos e layout do jogo
- `js/script.js` — lógica do jogo, timer, validações, animações e reinicialização
- `images/` — imagens do cofre e elementos visuais
- `sounds/` — efeitos sonoros e música de fundo

## Como executar

1. Abra a pasta do projeto no navegador.
2. Clique no arquivo `index.html`.
3. Inicie o jogo e descubra a combinação.

## Como jogar

1. Clique em "INICIAR OPERAÇÃO".
2. Insira um número entre 00 e 50.
3. Envie a tentativa.
4. Use as dicas para ajustar sua próxima tentativa.
5. Descubra a senha antes do tempo acabar.

## Objetivo

Adivinhar a combinação secreta do cofre antes que o contador termine ou que as tentativas se esgotem.

## Observação

Este projeto é uma implementação frontend estática, sem banco de dados ou backend, voltada para demonstração de lógica de jogo e interação em navegador.

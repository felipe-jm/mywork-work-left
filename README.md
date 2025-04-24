# MyWork Time Left

## Descrição

MyWork Time Left é uma extensão para o Chrome que exibe informações sobre seu tempo de trabalho restante na plataforma MyWork. A extensão analisa a página de registro de ponto e calcula automaticamente quanto tempo falta para completar sua jornada diária de 8 horas.

## Funcionalidades

- Cálculo automático do tempo de trabalho restante
- Atualização em tempo real quando a página é atualizada ou quando você volta para a aba
- Exibição de diferentes status:
  - ✅ Dia completo! Até amanhã! - quando você já completou o dia de trabalho
  - ⚠️ Hora extra - quando você excedeu as 8 horas diárias
  - 🕛 Intervalo de almoço - durante o horário de almoço
  - Tempo restante normal - mostrando as horas e minutos que faltam para completar o dia

## Instalação

### Método 1: Instalação a partir do código-fonte

1. Clone este repositório:
   ```
   git clone https://github.com/felipe-jm/mywork-work-left.git
   ```
2. Entre na pasta do projeto:
   ```
   cd mywork-work-left
   ```
3. Instale as dependências:
   ```
   npm install
   ```
4. Compile o projeto:
   ```
   npm run build
   ```
5. Abra o Chrome e navegue até `chrome://extensions/`
6. Ative o "Modo de desenvolvedor" no canto superior direito
7. Clique em "Carregar sem compactação" e selecione a pasta do projeto

### Método 2: Instalação como extensão empacotada

1. Baixe o arquivo `.zip` da última versão
2. Descompacte o arquivo
3. Abra o Chrome e navegue até `chrome://extensions/`
4. Ative o "Modo de desenvolvedor" no canto superior direito
5. Clique em "Carregar sem compactação" e selecione a pasta descompactada

## Como usar

1. Após instalar a extensão, navegue até o site do MyWork (https://app.mywork.com.br)
2. Faça login e acesse a página de registro de ponto
3. A extensão automaticamente exibirá uma mensagem com o tempo restante de trabalho

## Desenvolvimento

### Configuração do ambiente de desenvolvimento

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Execute `npm run watch` para compilação contínua durante o desenvolvimento
4. Carregue a extensão no Chrome como descrito na seção de instalação

### Estrutura do projeto

- `src/content.ts` - Código principal da extensão
- `manifest.json` - Configuração da extensão
- `tsconfig.json` - Configuração do TypeScript
- `package.json` - Dependências e scripts

## Solução de problemas

- **A extensão não aparece**: Verifique se a URL do site está correta no manifest.json
- **O tempo não é calculado corretamente**: Verifique no console do navegador se há erros
- **A extensão não atualiza**: A extensão atualiza quando você muda de abas. Se isso não ocorrer, recarregue a página

## Tecnologias utilizadas

- TypeScript
- Chrome Extension API

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

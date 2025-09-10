# Sistema de Gestão de Manômetros

Sistema completo para gerenciamento de manômetros com controle de validade e alertas de vencimento.

## Funcionalidades

- 📊 Dashboard com estatísticas em tempo real
- 📝 Cadastro completo de manômetros
- 📋 Lista de manômetros com busca
- ⚠️ Alertas automáticos de vencimento
- 🔍 Busca por qualquer campo
- 💾 Armazenamento no MongoDB

## Configuração

### 1. Instalar dependências

\`\`\`bash
npm install
\`\`\`

### 2. Configurar MongoDB

1. Copie o arquivo `.env.example` para `.env.local`
2. Substitua `<db_password>` pela senha real do seu banco MongoDB
3. A URL do MongoDB já está configurada para usar a coleção "Monometro" -> "data"

### 3. Executar o projeto

\`\`\`bash
npm run dev
\`\`\`

O sistema estará disponível em `http://localhost:3000`

## Estrutura do Banco de Dados

O sistema usa MongoDB com a seguinte estrutura:

- **Database**: Monometro
- **Collection**: data
- **Campos do documento**:
  - serialNumber: Número de série do manômetro
  - manufacturer: Fabricante
  - model: Modelo
  - measurementRange: Faixa de medição
  - precision: Precisão
  - location: Localização
  - validityDate: Data de validade
  - nextInspection: Próxima inspeção
  - status: Status (ativo/inativo)
  - observations: Observações
  - createdAt: Data de criação
  - updatedAt: Data de atualização

## API Endpoints

- `GET /api/manometros` - Listar todos os manômetros
- `POST /api/manometros` - Criar novo manômetro
- `PUT /api/manometros` - Atualizar manômetro existente
- `DELETE /api/manometros?id={id}` - Deletar manômetro

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- React 19
- TypeScript
- MongoDB
- Tailwind CSS
- Shadcn/ui
- Lucide React (ícones)

# Finzy

Consiste em desenvolver uma plataforma para organização financeira pessoal. O sistema permite o cadastro de usuários e armazenamento de seus dados para facilitar a gestão de informações como nome completo, telefone e email. O foco principal está na simplicidade e eficiência da aplicação usando Flask e SQLite.
## 🔧 Requisitos:

- Python 3.8+

- Flask

- Banco de dados: SQLite

### 🗃️ Tabela 'usuarios':
A tabela principal do sistema é usuarios, responsável por armazenar os dados dos usuários cadastrados:
```
id: UUID ou int (chave primária)
timestamp: timestamp (data de criação)
nomeCompleto: text (opcional)
telefone: text (opcional)
email: text (opcional)
```

## 🔐 Configuração de acesso ao banco de dados
Para simular uma configuração de ambiente (opcional):
```
DATABASE_URL=sqlite:///usuarios.db
DATABASE_KEY= -- 
```

## 📁 Estrutura do projeto:
```
finzy/
├── main.py                 # Arquivo principal que inicia a aplicação Flask
├── database_client.py      # Gerencia a conexão e operações com o banco de dados
├── templates/
│   └── index.html          # Template HTML principal
├── static/
│   └── figura.jpg          # Imagem usada na interface
├── requirements.txt        # Lista de dependências do projeto
└── README.md               # Este arquivo
```

## 📦 Instale os requisitos do projeto:
```
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
```

## 🚀 Execute o projeto:
```
python run.py
```


const express = require("express")
const mongoose = require("mongoose")
const app = express();
const port = 5500
const Category = require('./Models/Category')
app.use(express.json());



const categoryQuestions  = {
    Animais: [
        { description: "Animal que mia", answer: "Gato" },
        { description: "Maior animal terrestre", answer: "Elefante" },
        { description: "Mamífero que voa", answer: "Morcego" },
        { description: "Rei da selva", answer: "Leão" },
        { description: "Animal que põe ovos e tem bico", answer: "Pato" },
    ],
    História: [
        { description: "Ano da independência do Brasil", answer: "1822" },
        { description: "Primeira Guerra Mundial começou em qual ano?", answer: "1914" },
        { description: "Quem descobriu o Brasil?", answer: "Pedro Álvares Cabral" },
        { description: "Nome da cidade onde Napoleão nasceu", answer: "Ajaccio" },
        { description: "Qual foi o primeiro imperador do Brasil?", answer: "Dom Pedro I" },
    ],
    Ciência: [
        { description: "Elemento químico essencial para respirar", answer: "Oxigênio" },
        { description: "O planeta vermelho", answer: "Marte" },
        { description: "Unidade básica da vida", answer: "Célula" },
        { description: "Nome do cientista que formulou a teoria da relatividade", answer: "Einstein" },
        { description: "Fenômeno que permite um avião voar", answer: "Aerodinâmica" },
    ],
    Esportes: [
        { description: "Esporte mais popular do Brasil", answer: "Futebol" },
        { description: "País que sediou as Olimpíadas de 2016", answer: "Brasil" },
        { description: "Esporte jogado com raquete e rede", answer: "Tênis" },
        { description: "Quantos jogadores tem um time de vôlei?", answer: "6" },
        { description: "Esporte em que se luta dentro de um octógono", answer: "MMA" },
    ],
    Cinema: [
        { description: "Filme onde um robô se apaixona pela robô Eva", answer: "Wall-E" },
        { description: "Filme famoso sobre dinossauros", answer: "Jurassic Park" },
        { description: "Série de filmes com sabres de luz", answer: "Star Wars" },
        { description: "Super-herói milionário da Marvel", answer: "Homem de Ferro" },
        { description: "Filme onde um peixe chamado Nemo é perdido", answer: "Procurando Nemo" },
    ],
};





app.get('/category/:name',async(req,res)=>{
     try {
    const { name } = req.params;
    console.log(name);

    const category = await Category.findOne({name});

    if (!category) {
      return res.status(404).send({ message: "Categoria não encontrada" });
    }

    res.send(category);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro ao buscar categoria" });
  }
})

app.listen(port,async()=>{
    mongoose.connect('mongodb+srv://pedroleonardo2001:LRqDb2hdeyQ4jpGt@duo.9k1o8hq.mongodb.net/?retryWrites=true&w=majority&appName=Duo');

    console.log("Funiçando")
})


app.post('/insert',async(req,res)=>{
     try {
        const result = await seedCategories();
        res.status(200).json({ message: 'Categorias inseridas com sucesso', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao inserir categorias' });
    }
})


async function seedCategories(){
    await Category.insertMany(categories);
    const categories = Object.entries(categoryQuestions).map(([name,questions])=>({
        name,
        questions
    }))
    await Category.deleteMany()

    console.log(categoryQuestions)
    console.log('Categoria inseriada com sucesso')
    return categoryQuestions
}








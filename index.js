const koa = require("koa");
const bodyparser = require("koa-bodyparser")

const server = new koa();

server.use(bodyparser());

const listaProduto = [{ 
    id: '1234567',
    nome: 'Fone de Ouvido',
    qtdDisponivel: 3,
    valor: 29.00,
    deletado: false }
]

const condicoesErro = (produto,ctx)=>{ 
    console.log(ctx.request.body.id,produto.id)
    if(ctx.request.body.id === produto.id ){
    ctx.status = 404;
    ctx.body = {
        status: 'erro',
        dados: {
            mensagem: 'O produto já existe'
        }
    }
  }else if(!ctx.request.body.nome || !ctx.request.body.valor || !ctx.request.body.qtdDisponivel || !ctx.request.body.id){
    ctx.status = 404;
    ctx.body = {
        status: 'erro',
        dados: {
            mensagem: 'Informações incompletas'
        }
  }
} else{
    ctx.status = 200;
    produto.push(ctx.request.body);
    ctx.body = {
        status: 'sucesso',
        dados: {
            mensagem: 'Produto adicionado com sucesso!'
        }
    }
    console.log(listaProduto)
    }
 }

 server.use((ctx) =>{
    if(ctx.url.includes('/product')){
    if(ctx.method === 'POST'){
    listaProduto.forEach((item) =>{
            condicoesErro(item,ctx)
        }
        )
    } else if(ctx.method === 'GET'){
        if(ctx.url.includes(`/:${id}`))
    }
} 
else if(ctx.url.includes('/orders')){

    }
else {
    ctx.status = 404;
    ctx.body = {
        status:  'erro',
        dados: {
            mensagem: 'Mensagem descrevendo o erro!'
        }
     }
    }
})

server.listen(8081, ()=>console.log("Está rodando certinho"));
const koa = require("koa");
const bodyparser = require("koa-bodyparser")

const server = new koa();

server.use(bodyparser());
const listaProduto = [{ 
    id: '1234567',
    nome: 'Fone de Ouvido',
    qtdDisponivel: 3,
    valor: 29.00,
    deletado: false },
    { 
        id: '1234567',
        nome: 'Fone de Ouvido',
        qtdDisponivel: 3,
        valor: 29.00,
        deletado: false }
]
const listaPedidos = [
    {
    id: '07284113502',
    produtos : listaProduto,
    estado: 'incompleto',
    idCliente: '321654',
    deletado: false,
    valorTotal: 58.00
    },
    {
    id: '2345678910',
    produtos : listaProduto,
    estado: 'incompleto',
    idCliente: '321654',
    deletado: false,
    valorTotal: 58.00
    }
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
 function tratandoProdutos (lista){
    const listaTratada = lista.filter((item)=>{
        if(item.id){
            if(item.qtdDisponivel !== 0){
                if(!item.deletado){
                    return true
                } else 
                    return false
                
            } else
                return false
            
        }else 
            return false  
    })
    return listaTratada
 }
    function calculandoValor (listaCalc) {
        let total = 0;
        listaCalc.forEach((item)=>{
            total = item.valor + total
        })
        return total
    }
    console.log(calculandoValor(listaProduto))
 let checagem = false;
 let checagem2 = false;

 server.use((ctx) =>{
    if(ctx.url.includes('/product')){
    if(ctx.method === 'POST'){
    listaProduto.forEach((item) =>{
            condicoesErro(item,ctx)
        })
    } else if(ctx.method === 'GET'){
        const id = ctx.url.split('/')[2]
        listaProduto.forEach( (item)=>{
            if(id===item.id){
                ctx.body = item
                checagem = true;    
            }
        })
        if(!checagem){
            ctx.body =  listaProduto
        }
        
    } else if(ctx.method === 'PUT'){
        const idAtt = ctx.url.split('/')[2];
        const body = ctx.request.body
        if(idAtt){
            listaProduto.forEach((item,i)=>{
            if(!item.deletado){ 
                if(item.id === idAtt){
                    const produtoAtt = {
                      id: body.id ? body.id : item.id,
                      nome: body.nome ? body.nome : item.nome,
                      qtdDisponivel: body.qtdDisponivel ? body.qtdDisponivel: item.qtdDisponivel,
                      valor: body.valor ? body.valor : item.valor,
                      deletado: body.deletado ? body.deletado : item.deletado,
                      verificado: true
                    }  
                  listaProduto[i] = produtoAtt;
                  ctx.body = {
                      status: 'sucesso',
                      dados : {
                          mensagem: 'O produto foi atualizado com sucesso'
                      }
                   }
                } 
             }
        }) 

    }   else {
            ctx.status = 404;
            ctx.body = {
                    status:  'erro',
                    dados: {
                        mensagem: 'Pedido mal formulado'
                    } 
            }
        }
    } else if(ctx.method === 'DELETE'){
        const idDel = ctx.url.split('/')[2];
        const body = ctx.request.body
        listaProduto.forEach((item,i)=>{
            if(item.id === idDel){
                const produtoDel = {
                  deletado: true
                }
                listaProduto[i].deletado = produtoDel;
                ctx.body = {
                    status: 'sucesso',
                      dados : {
                          mensagem: 'O produto foi deletado com sucesso'
                      }
                }
            } else {
                ctx.status = 404;
            ctx.body = {
                    status:  'erro',
                    dados: {
                        mensagem: 'Pedido mal formulado'
                    } 
                }
            }
        })
    }
}
    else if(ctx.url.includes('/orders')){
        if (ctx.method === 'POST'){
           if(ctx.request.body.id || ctx.request.body.estado || ctx.request.body.idCliente || ctx.request.body.deletado || ctx.request.body.valorTotal){ 
            if(ctx.request.body.produtos && ctx.request.body.produtos.length !== 0 ){ 
            const pedido = ctx.request.body;
            if(pedido.estado === 'incompleto'){         
            const produtosDoPedido = tratandoProdutos(pedido.produtos); 
            pedido.produtos = produtosDoPedido
            pedido.valorTotal = calculandoValor(produtosDoPedido)    
            pedido.estado = 'processando'
        } else{
            ctx.status =  404;
            ctx.body = {
                status: 'Erro',
                dados: {
                    mensagem: 'Pedido ja foi processado'
                }
                
            }
                    }
                 }
            else {
                console.log('vim para o caminho certo mas algo deu errado')
            ctx.status = 404;
            ctx.body = {
                status:  'erro',
                 dados: {
                     mensagem: 'Mensagem descrevendo o erro!'
                 }
            }     
        }
      }
    }else if(ctx.method === 'GET'){
        const idPedido = ctx.url.split('/')[2];
        listaPedidos.forEach((item)=>{
           if(!item.deletado){ 
            if(idPedido === item.id){
                ctx.body = item;
                checagem= true;
                 } 
            }else {
                ctx.body = {
                    status:'erro',
                    mensagem:{
                        dados: 'Esse item está deletado'
                    }
                }
            }
        });
        console.log(listaPedidos)
        if(!checagem){
            for(let i= 0; i<listaPedidos.length;i++){
               if(!listaPedidos[i].deletado) {
                ctx.body = listaPedidos[i]
               }else{
                ctx.body = {
                    status:'erro',
                    mensagem:{
                        dados: 'Esse item está deletado'
                    }
               }
            } 
        }

    }
}else if(ctx.method === 'PUT'){
    
}
else if(ctx.method === 'DELETE'){
    const idDel = ctx.url.split('/')[2];
    const body = ctx.request.body   
    listaPedidos.forEach((item,i)=>{
        if(item.id === idDel){
            const produtoDel = {
              deletado: true
            }
            listaPedidos[i].deletado = produtoDel
            ctx.body = {
                status: 'sucesso',
                mensagem: {
                    dados: 'Pedido deletado com sucesso'
                }
            }
        } else {
            ctx.body = {
                status: 'erro',
                mensagem: {
                    dados: 'Solicitação mal formulada'
                }
            }
        }
    })  
  } 
}   else {
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
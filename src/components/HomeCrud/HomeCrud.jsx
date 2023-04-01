import React, { Component } from "react";
import axios from "axios";


const baseUrl = "http://localhost:3001/books"; // endpoint do json com os dados do banco de dados em JSON server
const initialState = {
  book: {
    "author": "",
    "surname": "",
    "title": "",
    "publisher": "",
    "edition": null,
    "year": null
  },
  list: [] // cópia do banco de dados json server para alterar localmente
}


// Classe porque preciso de estado com ciclo de vida para alterar o crud
export default class HomeCrud extends Component {

    state = { ...initialState } // criar state inicial 

    // Após carregada a página (ciclo de vida da renderização)
    componentDidMount(){
        axios(baseUrl).then(response => { // requisição para resgatar dados do banco de dados json server
            this.setState({ list: response.data });
        })
    }

    clear() { // limpar formulário ao clicar no botão de cancelar
      this.setState({ book: initialState.book })
    }

    save() { // salvar o livro que estou incluindo em tempo de execução
        const book = this.state.book;
        const method = book.id ? "put" : "post"; // put: alterar livro se o id estiver preenchido. Post inclui o livro se não tiver id.
        const url = book.id ? `${baseUrl}/${book.id}` : baseUrl;

        // chamada para o back-end pela biblioteca axios
        axios[method](url, book)
            .then(response => {
                
                const list = this.getUpdatedList(response.data);
                this.setState({book: initialState.book, list } );
            })
        }

    getUpdatedList(book, add = true) {
        const list = this.state.list.filter(i => i.id != book.id); // selecionar todos os livros exceto o do parâmetro
        if (add == true) {
             list.unshift(book); // adicionar livro na primeira posição da lista
        }
        return book;
    }
    

    updateField(event) {
        const book = {... this.state.book}; // clonar livro para alterar objeto depois no setState
        book[event.target.title] = event.target.value;
        this.setState({ book });
    }

    // Atualizar registro
    load(book) {
        this.setState({ book });
    }
    // Remover registro
    remove(book) {
        
        axios.delete(`${baseUrl}/${book.id}`).then(response => {
            const list = this.getUpdatedList(book, false);
            this.setState({ list });
        });
    }
    // Ler tabela e linhas
    renderTable(){
        return (
            <div className="table-responsive">
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Nome do autor</th>
                        <th>Sobrenome</th>
                        <th>Editora</th>
                        <th>Edição</th>
                        <th>Ano</th>
                    </tr>
                </thead>

                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
            </div>
        )
    }

    renderRows(){
        if (!Array.isArray(this.state.list)) {
            return this.componentDidMount();
        }

        return this.state.list.map((book) => {
            return (
                <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.surname.toUpperCase()}</td>
                    <td>{book.publisher}</td>
                    <td>{book.edition}</td>
                    <td>{book.year}</td>
                    <td>
                        <button className="btn btn-warning x-2 mt-2 mb-2 ms-3" onClick={() => this.load(book)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger x-2 mt-2 mb-2 ms-3" onClick={() => this.remove(book)}>
                            <i className="fa fa-trash"></i>
                        </button>
                        
                    </td>
                </tr>
            )
        })
    }

    // Método para mostrar o formulário para adicionar/editar livro
    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Título do livro</label>
                            <input type="text" className="form-control mb-3" title="title" value={this.state.book.title  || ''} 
                                onChange={e => this.updateField(e)} placeholder="Digite o título do livro" />
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Nome do autor</label>
                            <input type="text" className="form-control mb-2" title="author" value={this.state.book.author  || ''} 
                                onChange={e => this.updateField(e)} placeholder="Primeiro nome do autor" />
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Sobrenome do autor</label>
                            <input type="text" className="form-control mb-2" title="surname"  value={this.state.book.surname.toUpperCase() || ''} 
                                onChange={e => this.updateField(e)} placeholder="Sobrenome" />
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Editora</label>
                            <input type="text" className="form-control mb-2" title="publisher" value={this.state.book.publisher  || ''} 
                                onChange={e => this.updateField(e)} placeholder="Editora" />
                        </div>
                    </div>
                    <div className="col-12 col-md-1">
                        <div className="form-group">
                            <label>Edição</label>
                            <input type="number" className="form-control mb-2" title="edition" min="0" value={this.state.book.edition  || ''} 
                                onChange={e => this.updateField(e)} placeholder="Edição" />
                        </div>
                    </div>
                    <div className="col-12 col-md-1">
                        <div className="form-group">
                            <label>Ano</label>
                            <input type="number" className="form-control mb-2" title="year" min="1000" value={this.state.book.year  || ''} 
                                onChange={e => this.updateField(e)} placeholder="Publicação" />
                        </div>
                    </div>
                </div>

                <hr/>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-secondary" onClick= {e => this.clear(e)} >Cancelar</button>
                        <button className="btn btn-primary ms-3" onClick= {e => this.save(e)} >Salvar</button>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        return (
            <div>
                <main className="content container-fluid">
                    <div className="p-3 mt-3">
                        <h5>Adicionar livro</h5>
                        {this.renderForm()}
                        {this.renderTable()}
                    </div>
                </main>

            </div>
        )
    }
}
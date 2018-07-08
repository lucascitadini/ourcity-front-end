import { CategoriaDTO } from "./categoria.dto";
import { StatusDTO } from "./status.dto";

export interface Ocorrencia {
    id: string,
    latitude: number,
    longitude: number,
    enderecoCompleto: string,
    descricao: string,
    categoria: CategoriaDTO,
    status: StatusDTO,
    idUsuario: string,
    nomeUsuario: string,
    dataCriacao: string,
    totalApoios: number,
    totalComentarios: number,
    imageUrl?: string,
    imageUrlUsuario?: string
}
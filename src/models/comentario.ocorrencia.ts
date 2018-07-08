export interface ComentarioOcorrencia {
    id: string,
    descricao: string,
    instante: string,
    idUsuario: string,
    idOcorrencia: string,
    nomeUsuario: string,
    imageUrlUsuario?: string
}
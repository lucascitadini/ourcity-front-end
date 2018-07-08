import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { Ocorrencia } from "../../models/ocorrencia";
import { ComentarioOcorrencia } from "../../models/comentario.ocorrencia";
import { ComentarioOcorrenciaDTO } from "../../models/comentario.ocorrencia.dto";
import { OcorrenciaDTO } from "../../models/ocorrencia.dto";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class OcorrenciaService {

    constructor(
        public http: HttpClient,
        public imageUtilService: ImageUtilService) {
    }

    findAll(page : number = 0, linesPerPage : number = 24) {
        return this.http.get<Ocorrencia[]>(
            `${API_CONFIG.baseUrl}/ocorrencias/?page=${page}&linesPerPage=${linesPerPage}`);
    }

    findByEnderecoCompleto(page : number = 0, linesPerPage : number = 24, endereco : string) {
        return this.http.get<Ocorrencia[]>(
            `${API_CONFIG.baseUrl}/ocorrencias/page/?page=${page}&linesPerPage=${linesPerPage}&endereco=${endereco}`);
    }

    findById(id: string) : Observable<Ocorrencia> {
        return this.http.get<Ocorrencia>(`${API_CONFIG.baseUrl}/ocorrencias/${id}`);
    }

    findComentariosPageByIdOcorrencia(id: string, page : number = 0, linesPerPage : number = 24) {
        return this.http.get<ComentarioOcorrencia[]>(`${API_CONFIG.baseUrl}/ocorrencias/comentarios/page/?idOcorrencia=${id}&page=${page}&linesPerPage=${linesPerPage}`);
    }

    getImageFromBucket(id: string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/ocr${id}.jpg`;
        return this.http.get(url, {responseType: 'blob'});
    }

    insertComentario(obj : ComentarioOcorrenciaDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/ocorrencias/comentarios`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    deletaComentario(id: string) {
        return this.http.delete(
            `${API_CONFIG.baseUrl}/ocorrencias/comentarios/${id}`, 
            {
                observe: 'response', 
                responseType: 'text'
            }
        );
    }

    removerOcorrencia(id: string) {
        return this.http.delete(
            `${API_CONFIG.baseUrl}/ocorrencias/${id}`, 
            {
                observe: 'response', 
                responseType: 'text'
            }
        );
    }

    insertOcorrencia(obj : OcorrenciaDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/ocorrencias`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    uploadPicture(id: string, picture) {
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData : FormData = new FormData();
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(
            `${API_CONFIG.baseUrl}/ocorrencias/picture/${id}`, 
            formData,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }
}
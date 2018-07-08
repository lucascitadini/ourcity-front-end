import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { StatusDTO } from "../../models/status.dto";

@Injectable()
export class StatusService {

    constructor(public http: HttpClient) {
    }

    findAll() : Observable<StatusDTO[]> {
        return this.http.get<StatusDTO[]>(`${API_CONFIG.baseUrl}/status`);
    }
}
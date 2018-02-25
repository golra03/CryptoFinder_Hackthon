import { Injectable } from '@angular/core';
import { RestCallsComponent } from '../services/httpServices';
import { ApplicationComponents } from '../services/applicationComponents';
import { NotificationService } from "../services/NotificationService";

@Injectable()

export class DataTransferService{

	private university:any = {};
	private user:any = {};
    private student:any = {};
    private certificate:any = {};
    private batch:any = {};
    private studentBatchForCertificate:any = {};
    private verifiedBatchesForIssuer:any = {};
    private requestsForAInstitution:any= [];
	constructor(){
	}

    getUniversity(){
        return this.university;
    }
    getUser(){
        return this.user;
    }
    getStudent(){
        return this.student;
    }
    getCertificate(){
        return this.certificate;
    }
    getBatch(){
        return this.batch;
    }
    getStudentBatchForCertificate(){
        return this.studentBatchForCertificate;
    }    
    getVerifiedBatchesForIssuer(){
        return this.verifiedBatchesForIssuer;
    }
    getRequestsForInstitution(){
        return this.requestsForAInstitution;
    }
    setStudentBatchForCertificate(arg){
        this.studentBatchForCertificate = arg;
    }
    setUniversity(arg){
        this.university = arg;
    }
    setUser(arg){
        this.user = arg;
    }
    setStudent(arg){
        this.student = arg;
    }
    setCertificate(arg){
        this.certificate = arg;
    }
    setBatch(arg){
        this.batch = arg;
    }
    setVerifiedBatchesForIssuer(arg){
        this.verifiedBatchesForIssuer = arg;
    }
    setRequestsForInstitution(arg){
        this.requestsForAInstitution = arg;
    }
}
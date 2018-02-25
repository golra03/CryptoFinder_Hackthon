import { Injectable } from '@angular/core';
import { Http,ResponseContentType } from '@angular/http';
import { ApplicationComponents } from '../services/applicationComponents';


@Injectable()

export class RestCallsComponent{

	private temp:any;
	private token:any = "";
	private url:any = "";
	private role:any = "";
	private studentTemp:any = {};

	constructor(private http:Http,private appConstants:ApplicationComponents){

	}

	grtTemp(){
		return this.temp;
	}
	setTemp(arg){
		this.temp = arg;
	}
	getStudentFile(){
		return this.studentTemp;
	}
	setStudentTemp(arg){
		this.studentTemp = arg;
	}
	setTokenAndUrl(){
		var temp = JSON.parse(localStorage.getItem("login"));
		console.log(temp);
		this.token = temp.token;
		this.url = temp.url;
		console.log(this.token + "   "+ this.url)
	}
	repayLoans(data){
		console.log(data);
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/repay",data);
	}
	getAllApprovedLoans(data){
		console.log(data);
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/getLoans",data);				
	}
	grantLoan(data){
		data.token = "1eda82802344d-198d22-11e832-b5437-750eed555585d";
		console.log(data);
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/admin/grantLoan",data);		
	}
	approveLoan(data){
		data.token = "1eda82802344d-198d22-11e832-b5437-750eed555585d";
		console.log(data);
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/admin/approveLoan",data);
	}
	RequestForLoans(data){
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/newLoan",data);
	}
	getAllPendingLoans(){
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/admin/getLoans",{token:"1eda82802344d-198d22-11e832-b5437-750eed555585d"});		
	}
	customerRegistrationCall(data){
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/add/customer",data);
	}
	createUniversity(universityInformation){
		universityInformation.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/add/university",universityInformation);
	}

	getUniversity(){
		return this.http.get(this.appConstants.getUrlAndPortForCustomer()+"/get/university");
	}

	getAllRequests(){
		return this.http.get(this.appConstants.getUrlAndPortForConsumer()+"/educationalDetails/all")
	}
	customerLogin(loginData){
		console.log("universityLogin");
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/customer/login",loginData);
	}
	viewMassUploadCertificate(data){
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/massUploaded/view",data,{responseType:ResponseContentType.Blob});		
	}
	massUploadCertificates(dara){
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/massupload",dara);
	}
	massUploadAdditionalData(data){
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/MassCertificateData",data);		
	}
	SendUploadedCertificatesToSigner(data){
		data.token = this.token;
		data.url = this.url;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/confirm/massupload",data);
	}
	deleteCertificates(data){
		console.log(data);
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/delete/certificates",data);
	}
	SendMassCreateCertificates(data){
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/send/massCreatedCertificate",data);
	}
	getUniversityForId(id){
		id.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForApplicationAdmin()+"/get/university/id",id);
	}
	signCertificatesStudent(data){
		var token:any = {};
	    token.token = this.token;
	    token.url = this.url;
	    data.token = token;
		return this.http.post(this.appConstants.getUrlAndPortForStudent()+"/sign/student/certificate",data);
	}
	getInstitutions(id){
		var token:any = {};
	    token.token = this.token;
	    token.url = this.url;
	    id.token = token;
	    console.log(token);
		return this.http.post(this.appConstants.getUrlAndPortForApplicationAdmin()+"/get/institutes/id",id);
	}
	getInstitutionsWithMoreThanOneRequestCount(id){
		var token:any = {};
	    token.token = this.token;
	    token.url = this.url;
	    id.token = token;
	    console.log(token);
		return this.http.post(this.appConstants.getUrlAndPortForApplicationAdmin()+"/get/ViewRequestGT1/institutes",id);
	}
	getCoursesForInstitute(institute){
		var data:any = institute;
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/courses/institute",data);
	}
	getRequestsforInstiId(data){
		return this.http.post(this.appConstants.getUrlAndPortForConsumer()+"/get/requestsForId",data);
	}
	getBatchForCourseAndInstitute(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/batch/course/institute",data);
	}

	validateOTP(otp){
		console.log(otp);
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/university/login/OTP/Check",otp);
	}

	universityLogout(data){
		console.log(data);
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/customer/logout",data);
	}

	getCertificatesForBatchAndInstitutionAndUniversity(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/certificates/batch/instution/university",data);
	}

	getCertificatesForBatchAndInstitutionAndUniversityForApprover(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/approver/certificates",data);		
	}

	getApprovedCertificates(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/approved/certificates",data);				
	}

	getUniversityUserForId(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/universityUser/id",data);
		
	}

	sendCertificatesForSigner(data){
		console.log(data);
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/send/certificates/signer",data);
	}

	getAllBatchesNotVerified(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/batches/not/verified",data);
	}

	getAllBatchesVerified(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/verified/batches",data);		
	}

	signTheCertificates(data){
		data.token = this.token;
		data.url = this.url;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/sign/theCertificates",data);
	}

	getAllVerifiedCertificates(data){
		data.token = this.token;
		console.log("getAllVerifiedCertificates")
		console.log(data)
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/approved/certificates",data);
	}

	getCertificatesForGivenInformation(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/certificates/for/given",data);
	}

	getRejectedBatches(){
		var data = {token:""};
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/rejected/batches",data);
	}

	getAllVerifiedCertificatesForABatch(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/verified/certificates",data);
	}

	downLoadDoc(data){
		data.token = this.token;
		return this.http.post("http://"+location.hostname+":"+2004+"/get/survey/item",data);
	}

	updateStudentCountInBatch(data){
		var token:any = {};
	    token.token = this.token;
	    token.url = this.url;
	    data.token = token;		
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/update/StudentCountBatch",data);
	}
	addStudent(data){
		console.log(data);
		var token:any = {};
	    token.token = this.token;
	    token.url = this.url;
	    data.token = token;
		return this.http.post(this.appConstants.getUrlAndPortForStudent()+"/add",data);
	}

	getAllBatchesForStudents(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/batches/students",data);
	}

	getAllStudentsForABatch(data){
		var token:any = {};
	    token.token = this.token;
	    token.url = this.url;
	    data.token = token;
		return this.http.post(this.appConstants.getUrlAndPortForStudent()+"/get/students/batch",data);
	}

	createBatchForStudent(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/create/Batches",data);
	}

	addCertificates(data){
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/add/certificate",data);
	}
	viewUploadedDoc(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/view/certificate",data,{responseType:ResponseContentType.Blob});
	}
	certificatePreview(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/certificate/preview",data,{responseType:ResponseContentType.Blob});			
	}
	getAllApprovedCertificatesForABatch(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/view/approved/certificates",data);
	}

	verifyCertificatesInBlockchain(data){
		var token:any = {};
	    token.token = this.token;
	    token.url = this.url;
	    data.token = token;
		return this.http.post(this.appConstants.getUrlAndPortForStudent()+"/approve/certificates",data);
	}

	saveVerificationTokenForCertificate(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/save/verificationToken",data);
	}

	resendCertificatesForApprover(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/resend/certificate",data);
	}

	getListofStudents(data){
		var token:any = {};
	    token.token = this.token;
	    token.url = this.url;
	    data.token = token;
		return this.http.post(this.appConstants.getUrlAndPortForStudent()+"/get",data);
	}

	getRequests(requestData){
		requestData.token = this.token;
		requestData.url = this.url;
		return this.http.post(this.appConstants.getUrlAndPortForConsumer()+"/allRequests/StudentforUniversity",requestData);
	}

	certificateApprovalMonthWise(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/certificateApprovalMonthWise",data);
	}

	createCourse(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/create/course",data);
	}

	getCourse(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/get/course",data);
	}

	verifyAadharForStudent(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForStudent()+"/authAadhar",data);
	}

	cancelMassuploadTransaction(data){
		data.token = this.token;
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/delete/certificates",data);
	}
	massUploadStudentInformation(data){
		return this.http.post(this.appConstants.getUrlAndPortForStudent()+"/upload",data);		
	}
	createCertificateForAll(data){
		return this.http.post(this.appConstants.getUrlAndPortForCustomer()+"/massCreate/Certificate",data);
	}
}
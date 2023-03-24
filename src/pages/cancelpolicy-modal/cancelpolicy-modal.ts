import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, Loading,Nav } from 'ionic-angular';
import { CancelationPolicyPage } from '../cancelation-policy/cancelation-policy';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TransactionPage } from '../transaction/transaction';
// import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';
import { RegistrationPage } from '../login-section/registration/registration';
import { ProfilePage } from '../profile/profile';



@IonicPage()
@Component({
    selector: 'page-cancelpolicy-modal',
    templateUrl: 'cancelpolicy-modal.html',
})
export class CancelpolicyModalPage {
    @ViewChild(Nav) nav: Nav;
    data:any={};
    otp_value:any='';
    karigar_id:any=''
    otp:any='';
    karigar_detail:any={};
    gift_id:any='';
    gift_detail:any='';
    loading:Loading;
    redeemPoint:any={};
    redeemType:any={};
    UserType:any ={}
    
    
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public service:DbserviceProvider,public alertCtrl:AlertController,public loadingCtrl:LoadingController, public translate:TranslateService) {
        
        
        console.log();
        
            
        this.redeemType = this.navParams.get('redeem_type');
        console.log(this.redeemType);
        
        this.redeemPoint = this.navParams.get('redeem_point');
        this.karigar_id = this.navParams.get('karigar_id');
        this.gift_id = this.navParams.get('gift_id');
        this.UserType=this.service.karigar_info.user_type;
        this.data.payment_type= "Paytm";
        if(this.redeemType == 'gift'){
            this.data.payment_type= "Gift";
        }
        
    }
    
    ionViewDidLoad() {
        this.karigar_id = this.navParams.get('karigar_id');
        this.gift_id = this.navParams.get('gift_id');
        this.getOtpDetail();
        this.presentLoading();
    }
    
    
    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
    
    goOnCancelationPolicy(){
        this.navCtrl.push(CancelationPolicyPage)
    }
    
    getOtpDetail()
    {
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'gift_id':this.gift_id, "redeem_amount":this.redeemPoint},'app_karigar/sendOtp')
        .subscribe((r)=>
        {
            this.loading.dismiss();
            this.otp=r['otp'];
            this.karigar_detail=r['karigar'];
            this.gift_detail=r['gift'];
        });
    }
    resendOtp()
    {
        
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'gift_id':this.gift_id, "redeem_amount":this.redeemPoint},'app_karigar/sendOtp')
        .subscribe((r)=>
        {
            this.otp=r['otp'];
            console.log(this.otp);
        });
    }
    otpvalidation() 
    {
        this.otp_value=false;
        if(this.data.otp==this.otp)
        {
            this.otp_value=true
        }
    }
    
    submit()
    {
        
        this.presentLoading();
        console.log(this.data);
        
         if(!this.otp_value){
            this.showAlert("OTP required");
            return
        }
        else if(this.redeemType == 'gift'){
            
            if(!this.data.shipping_address){
                this.showAlert("Shipping address required");
                return
            }
        }
        else if(this.redeemType == 'Cash' && this.data.payment_type == 'Bank Transfer'){
            if(!this.data.account_holder_name  || !this.data.bank_name || !this.data.account_no || !this.data.ifsc_code){
                this.showAlert("Bank details are missing");
                return;
            }
         
        }
        else if(this.redeemType == 'Cash' && this.data.payment_type == 'UPI ID'){
            if(!this.data.upi_id){
                this.showAlert("UPI ID number required");
                return;
            }
         
        }
        if(!this.data.check){
            this.showAlert("Read cancelation policy");
            return
        }
        this.data.karigar_id = this.service.karigar_id,
        this.data.gift_id = this.gift_id,
        this.data.redeem_type = this.redeemType
        this.data.redeem_amount=  this.redeemPoint
        this.data.offer_id = this.gift_detail.offer_id,
        console.log('data');
        this.service.post_rqst( {'data':this.data},'app_karigar/redeemRequest')
        .subscribe( (r) =>
        {
            this.loading.dismiss();
            console.log(r);
            if(r['status']=="SUCCESS")
            {
                // this.navCtrl.setRoot(TabsPage,{index:'3'});
                this.navCtrl.push(HomePage);
                this.showSuccess("Redeem Request Sent Successfully");
            }
            else if(r['status']=="EXIST")
            {
                this.showAlert(" Already Redeemed!");
            }
        });
    }
    showAlert(text) {
        let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle: text,
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            },
            {
                text:'OK',
                cssClass: 'close-action-sheet',
                handler:()=>{
                    // this.navCtrl.push(TransactionPage);
                }
            }]
        });
        alert.present();
    }
    showSuccess(text)
    {
        let alert = this.alertCtrl.create({
            title:'Success!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
    presentLoading() 
    {
        this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: false
        });
        this.loading.present();
    }
    ionViewDidLeave()
    {
        console.log('leave');
        this.dismiss()
    }
    
    bankDetail()
    {
        console.log(this.data);
        if(this.data.check1==true)
        {
            this.data.ifsc_code=this.karigar_detail.ifsc_code;
            this.data.account_no=this.karigar_detail.account_no;
            this.data.account_holder_name=this.karigar_detail.account_holder_name;
            this.data.bank_name=this.karigar_detail.bank_name;

        }
        else{
            this.data.ifsc_code='';
            this.data.account_no='';
            this.data.account_holder_name='';
            this.data.bank_name='';

            
        }
        
        
    }


      
    myNumber()
    {
        console.log(this.data);
        if(this.data.check3==true)
        {
            this.data.upi_id=this.karigar_detail.upi_id;
           

        }
        else{
            this.data.upi_id='';
           

            
        }
        
        
    }

    goRegestrationsPage=()=>{
        this.navCtrl.push(ProfilePage,{'data':this.karigar_detail,"mode":'redeem_page'})
    }
    editProfilePage()
    {
        this.karigar_detail.edit_profile= 'edit_profile';
        this.navCtrl.push(RegistrationPage,{'data':this.karigar_detail,"mode":'edit_page'})
     
    }
    
    address()
    {
        console.log(this.data);
        if(this.data.check1==true)
        {
            this.data.shipping_address=this.karigar_detail.address + ' ,'+this.karigar_detail.city + ' ,'+this.karigar_detail.district +' ,'+ this.karigar_detail.state +' ,'+ this.karigar_detail.pincode;
        }
        else{
            this.data.shipping_address='';
        }
    }
    
    
    
    // $scope.validateMobile = function() {
    //     console.log("mobile validation");
    //     var input = document.getElementById('mobile_only');
    //     var pattern = /^[6-9][0-9]{0,9}$/;
    //     var value = input.value;
    //     !pattern.test(value) && (input.value = value = '');
    //     input.addEventListener('input', function() {
    //       var currentValue = this.value;
    //       if(currentValue && !pattern.test(currentValue)) this.value = value;
    //       else value = currentValue;
    //     });
    //   };
}

import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { createTranslateLoader } from '../redeem-type/redeem-type.module';
import { SiteListPage } from './site-list';

@NgModule({
  declarations: [
    SiteListPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteListPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class SiteListPageModule {}

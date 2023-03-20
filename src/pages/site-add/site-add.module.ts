import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { createTranslateLoader } from '../redeem-type/redeem-type.module';
import { SiteAddPage } from './site-add';

@NgModule({
  declarations: [
    SiteAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteAddPage),
    IonicSelectableModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class SiteAddPageModule {}

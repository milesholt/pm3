import { Injectable, Inject } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Definitions } from '../../app.definitions';
import { Library } from '../../app.library';

import { Platform } from '@ionic/angular';

//connect to default internal services
import { PdfServiceKendo } from './kendo/PdfService/pdf.service';


@Injectable()
export class InternalService {

  constructor(
    private platform: Platform,
    public lib: Library,
    public pdfKendo: PdfServiceKendo
  ){
  }

}

export { PdfServiceKendo }

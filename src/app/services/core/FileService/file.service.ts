import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { saveAs } from 'file-saver';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

declare var cordova: any;
declare var device: any;

@Injectable()
export class FileService {

  constructor(private transfer: FileTransfer, private file: File, private fileOpener: FileOpener, private platform: Platform) {}

  ini(){
  }

  downloadBlob(filename, data, mimeType) {
      var blob = new Blob([data], {
        type: mimeType
      });
      this.platform.ready().then(() => {
        if (this.platform.is('cordova')) {
          var storageLocation = this.file.dataDirectory;
          if (this.platform.is('android')) storageLocation = this.file.externalDataDirectory;
          if (this.platform.is('ios')) storageLocation = this.file.documentsDirectory;
          var folderPath = storageLocation;

          //device download functions
          const fileTransfer: FileTransferObject = this.transfer.create();
          const blobURL = URL.createObjectURL(blob);
          fileTransfer.download(blobURL, storageLocation).then((entry) => {
              //window.open(encodeURI(entry.fullPath),"_blank","location=no,enableViewportScale=yes");
              this.fileOpener.showOpenWithDialog(entry.fullPath(), mimeType)
                              .then(() => console.log('File is opened'))
                              .catch(e => console.log('Error opening file', e));
              console.log('download complete: ' + entry.toURL());
            }, (error) => {
              // handle error
              this.errorHandler(1);
          });

        } else {
          //browser download functions
          saveAs(blob, filename);
        }
      });
    }

    errorHandler(code){
      let msg:string;
      switch(code){
        case 1:
          msg = 'Failed to download.';
        break;
      }
      alert(msg);
    }

    dataURItoBlob(dataURI) {
      var isBase64 = dataURI.split(",")[0].split(";")[1] === "base64";
      var byteString;

      if (isBase64) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        byteString = atob(dataURI.split(",")[1]);
      } else {
        byteString = dataURI.split(",")[1];
      } // separate out the mime component

      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0]; // write the bytes of the string to an ArrayBuffer

      var ab = new ArrayBuffer(byteString.length); // create a view into the buffer

      var ia = new Uint8Array(ab); // set the bytes of the buffer to the correct values

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      } // write the ArrayBuffer to a blob, and you're done

      var blob = new Blob([ab], {
        type: mimeString
      });
      return blob;
    }

}

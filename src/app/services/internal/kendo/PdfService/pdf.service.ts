import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';

import { Path, Text, Group, pdf } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';

const { exportPDF } = pdf;

@Injectable()
export class PdfServiceKendo {

  constructor(){}

  async exportData(group, options:any = {
    paperSize: "A4",
    margin: {
      left: "1.5in",
      right: "1in",
      top: "1in",
      bottom: "1in"
    },
    forcePageBreak: '.pagebreak',
    landscape: false
  }) {
    // Create a path and draw a straight line
    // const path = new Path({
    //   stroke: {
    //     color: `#9999b6`,
    //     width: 2
    //   }
    // });
    //
    // path.moveTo(0, 50).lineTo(200, 50).close();
    //
    // // Create the text
    // const text = new Text(`Hello World!`, [20, 25], {
    //   font: `bold 15px Arial`
    // });

    // Place all the shapes in a group
    //const group = new Group();
    // group.append(path, text);
    return await exportPDF(group, options).then((data) => {
        //saveAs(data, "scene.pdf");
        //this.writeFile(data);
        return data;
    });
  }

}

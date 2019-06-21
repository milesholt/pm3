import { Path, Text, Group, pdf } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';

//import { CoreService } from '../services/core.service';

const { exportPDF } = pdf;

//UNUSED

export function beginExportPDF(group) {
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

  const options = { paperSize: "A4", landscape: false };
  exportPDF(group, options).then((data) => {
      //saveAs(data, "scene.pdf");
      //this.writeFile(data);

  });
}

// export function writeFile(data){
//   this.file.writeText(this.fileTextContent || data)
//     .then(result => {
//         this.file.readText()
//             .then(res => {
//                 this.successMessage = "Successfully saved in " + this.file.path;
//                 this.writtenContent = res;
//                 this.isItemVisible = true;
//             });
//     }).catch(err => {
//         console.log(err);
//     });
// }

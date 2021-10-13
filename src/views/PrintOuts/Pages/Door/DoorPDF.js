import pdfMake from 'pdfmake-lite/build/pdfmake';
import vfsFonts from 'pdfmake-lite/build/vfs_fonts';
import Acknowledgement from '../../Door_PDF/Acknowledgement';
import Invoice from '../../Door_PDF/Invoice';
import AssemblyList from '../../Door_PDF/AssemblyList';
import StilesPage from '../../Door_PDF/StilesPage';
import RailsPage from '../../Door_PDF/RailsPage';
import PanelsPage from '../../Door_PDF/PanelsPage';
import MaterialsList from '../../Door_PDF/MaterialsList';
import QC_Checklist from '../../Door_PDF/QC_Checklist';
import Profiles from '../../Door_PDF/Profiles';
import Packing_Slip from '../../Door_PDF/Packing_Slip';
import moment from 'moment';
import Glass_Selection from '../../Sorting/Glass_Selection';
import Door_Labels from '../../Door_PDF/Door_Labels';

export default (
  data,
  designs,
  edges,
  moulds,
  miter,
  mt,
  panels,
  appliedProfiles,
  breakdowns,
  p,
  pricing
) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  let Content = [];

  for (let i = 0; i < p.acknowledgement; i++) {
    Content.push(Acknowledgement(data, pricing));

    Content.push(
      Profiles(
        data,
        designs,
        edges,
        moulds,
        miter,
        mt,
        panels,
        appliedProfiles,
        breakdowns
      )
    );
  }

  for (let i = 0; i < p.invoice; i++) {
    Content.push(Invoice(data, pricing));
  }

  for (let i = 0; i < p.assembly_list; i++) {
    const type = 'Page';

    const newParts = Glass_Selection(data, type).map((j) => {
      const newData = { ...data, part_list: j };
      return newData;
    });

    newParts.map((k) => {
      return Content.push(AssemblyList(k, breakdowns));
    });
  }

  for (let i = 0; i < p.panels; i++) {
    Content.push(PanelsPage(data, breakdowns));
  }

  for (let i = 0; i < p.stiles; i++) {
    Content.push(StilesPage(data, breakdowns));
  }

  for (let i = 0; i < p.rails; i++) {
    Content.push(RailsPage(data, breakdowns));
  }

  for (let i = 0; i < p.profiles; i++) {
    Content.push(
      Profiles(
        data,
        designs,
        edges,
        moulds,
        miter,
        mt,
        panels,
        appliedProfiles,
        breakdowns
      )
    );
  }

  for (let i = 0; i < p.materials; i++) {
    Content.push(MaterialsList(data, breakdowns));
  }

  for (let i = 0; i < p.packing_slip; i++) {
    Content.push(Packing_Slip(data, breakdowns));
  }

  for (let i = 0; i < p.qc; i++) {
    Content.push(QC_Checklist(data, breakdowns));
  }

  for (let i = 0; i < p.door_labels; i++) {
    Content.push(Door_Labels(data, breakdowns));
  }

  const rowLen = Content.length;
  const ContentSorted = Content.map((i, index) => {
    if (rowLen === index + 1) {
      return [i];
    } else {
      return [i, { text: '', pageBreak: 'before' }];
    }
  });

  const fileName = `Order #${data.orderNum}`;

  const documentDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: ContentSorted,
    pageMargins: [40, 40, 40, 60],
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          {
            stack: [
              {
                text: moment().format('MM-D-YYYY'),
                style: 'warrantyFont',
              },
              {
                text: currentPage.toString() + ' of ' + pageCount,
                style: 'warrantyFont',
              },
            ],
            width: 250,
          },
          {
            stack: [
              {
                text: ' ',
                style: 'warrantyFont',
              },
              {
                text: fileName,
                style: 'warrantyFont',
                alignment: 'right',
              },
            ],
          },
        ],
        margin: [40, 10, 40, 0],
      };
    },
    pageBreakBefore: function (
      currentNode,
      followingNodesOnPage,
      nodesOnNextPage,
      previousNodesOnPage
    ) {
      return (
        currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
      );
    },
    styles: {
      woodtype: {
        fontSize: 15,
        bold: true,
      },
      orderNum: {
        fontSize: 24,
        bold: true,
      },
      fonts: {
        fontSize: 9,
      },
      fontsBold: {
        fontSize: 8,
        bold: true,
      },
      headerFont: {
        fontSize: 10,
        bold: true,
      },
      tableBold: {
        fontSize: 9,
        bold: true,
      },
      totals: {
        fontSize: 9,
        bold: true,
      },
      warrantyFont: {
        fontSize: 7,
      },
    },
  };

  pdfMake.createPdf(documentDefinition).open();
};

import moment from 'moment';
import Panels from '../Breakdowns/Doors/Panels/Panels';


export default (data, breakdowns) => {
  return data.part_list.map((i, index) => {



    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Style', style: 'fonts' },
        { text: 'Qty', style: 'fonts' },
        { text: 'Width x Length', style: 'fonts' },
        { text: 'Pat', style: 'fonts' },
        { text: 'Arch', style: 'fonts' },
        { text: 'Panel' }
      ]
    ];

    i.dimensions.forEach((item, index) => {
      tableBody.push([
        { text: index + 1, style: 'fonts' },
        { text: `${i.cope_design ? i.cope_design.NAME : i.mt_design ? i.mt_design.NAME + ' ' + i.construction.value : i.miter_design ? i.miter_design.NAME + ' ' + i.construction.value : i.miter_df_design ? i.miter_df_design.NAME + ' ' + i.construction.value : i.mt_df_design ? i.mt_df_design.NAME + ' ' + i.construction.value : i.construction.name} - ${i.panel ? i.panel.NAME : 'Glass'}`, style: 'fonts' },
        { text: Panels(item, i, breakdowns).map(panel => { return `${panel.qty} \n`; }), style: 'fonts' },
        { text: Panels(item, i, breakdowns).map(panel => { return `${panel.measurement} \n`; }), style: 'fonts' },
        { text: Panels(item, i, breakdowns).map(panel => { return `${panel.pattern} \n`; }), style: 'fonts' },
        { text: i.cope_design && i.cope_design.TOP_RAIL_ADD > 0 ? i.cope_design.NAME : '', style: 'fonts' },
        { text: `${i.panel ? i.panel.NAME : 'Glass'}`, style: 'fonts' }
      ]);
    });

    if (!i.panel || i.orderType.value === 'One_Piece') {
      return null;
    } else {
      return [
        {
          columns: [
            {
              stack: ['Individual - PANELS List', `Shipping Date: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`,]
            },
            {
              stack: [
                { text: 'Porta Door Co. Inc.', alignment: 'center' },
                { text: '65 Cogwheel Lane', alignment: 'center' },
                { text: 'Seymour, CT', alignment: 'center' },
                { text: '203-888-6191', alignment: 'center' },
                { text: moment().format('DD-MMM-YYYY'), alignment: 'center' }
              ]
            },
            {
              stack: [
                { text: data.job_info.Rush && data.job_info.Sample ? 'Sample / Rush' : data.job_info.Rush ? "Rush" : data.job_info.Sample ? 'Sample' : '', alignment: 'right', bold: true },
                { text: `Order #: ${data.orderNum}`, alignment: 'right' },
                { text: `Est. Completion: ${moment(data.job_info.DueDate).format('MM/DD/YYYY')}`, alignment: 'right' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: `${data.job_info.customer.Company}`,
            },
            {
              stack: [
                { text: `PO: ${data.job_info.poNum}`, alignment: 'right', }
              ]
            },
          ],
          margin: [0, 10]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
        },
        [
          {
            margin: [0, 10, 0, 0],
            columns: [
              { text: `${i.woodtype.NAME}`, style: 'woodtype' },
              {
                text: `IP: ${i.profile ? i.profile.NAME : 'None'}`,
                style: 'woodtype',
                alignment: 'left'
              },
              {
                text: '',
                alignment: 'left'
              },
              {
                text: 'WOOD PANELS',
                alignment: 'right',
                style: 'woodtype'
              }
            ]
          },
          {
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
            ],
            margin: [0, 10, 0, 0]
          },
          {
            table: {
              headerRows: 1,
              widths: [25, 100, 25, 100, '*', '*', 100],
              body: tableBody
            },
            layout: 'lightHorizontalLines'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }]
          }
        ],

        { text: '', pageBreak: 'before' }
      ];
    }



  });


};

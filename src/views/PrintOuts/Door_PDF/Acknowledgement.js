import pdfDoorPricing from '../../../selectors/pdfs/pdfDoorPricing';
import Size from '../Breakdowns/Doors/Size';
import Glass_Selection from '../Sorting/Glass_Selection';

export default (data, pricing) => {
  const prices = pdfDoorPricing(data.part_list, pricing[0], data.itemPrice);

  const pricingData = {
    ...data,
    part_list: data.part_list.map((i, index) => {
      return {
        ...i,
        dimensions: i.dimensions.map((j, p) => {
          return {
            ...j,
            price: prices[index][p],
          };
        }),
      };
    }),
  };

  const parts = Glass_Selection(pricingData, null);

  const qty = parts.map((part, i) => {
    return part.dimensions
      .map((dim, index) => {
        return parseInt(dim.qty);
      })
      .reduce((acc, item) => acc + item, 0);
  });

  const balancePaid = data.balance_history.reduce(function (
    accumulator,
    balance
  ) {
    return accumulator + (balance.balance_paid || 0);
  },
  0);

  const depositPaid = data.balance_history.reduce(function (
    accumulator,
    balance
  ) {
    return accumulator + (balance.deposit_paid || 0);
  },
  0);

  const misc_prices = data.misc_items.map((i) => {
    if (i.category === 'preselect') {
      return parseFloat(i.qty) * parseFloat(i.price);
    } else {
      return i.pricePer ? parseFloat(i.qty) * parseFloat(i.pricePer) : 0;
    }
  });

  const subTotal =
    Math.round(
      parts
        .map((i) =>
          i.dimensions.reduce(
            (acc, item) => acc + Math.round(item.price * 100) / 100,
            0
          )
        )
        .reduce((acc, item) => acc + Math.round(item * 100) / 100, 0) * 100
    ) / 100;

  const misc_total = misc_prices.reduce((acc, item) => acc + item, 0);

  const discountTotal =
    Math.round(
      ((subTotal * Math.floor((data.discount / 100) * 100)) / 100) * 100
    ) / 100;

  const discountSubTotal = subTotal - discountTotal;

  const order_sub_total = misc_total + discountSubTotal;

  const tax = data.Taxable
    ? Math.round(order_sub_total * (data.companyprofile.TaxRate / 100) * 100) /
      100
    : 0;

  const total = order_sub_total + tax;

  const balanceDue = total - depositPaid - balancePaid;

  let itemNum = 0;

  const table_content = Glass_Selection(pricingData, null).map((part, i) => {
    const tableBody = [
      [
        { text: 'Item', style: 'fonts' },
        { text: 'Actual Size WxH', style: 'fonts' },
        { text: 'Qty', style: 'fonts', alignment: 'center' },
        { text: 'Notes', style: 'fonts' },
        { text: 'Cab #', style: 'fonts' },
        { text: 'Total 1 Unit', style: 'fonts', alignment: 'right' },
        { text: 'Total Cost', style: 'fonts', alignment: 'right' },
      ],
    ];

    part.dimensions.forEach((item, index) => {
      itemNum += 1;

      tableBody.push([
        { text: item.item ? item.item : itemNum, style: 'fonts' },
        { text: `${Size(item)}`, style: 'fonts' },
        { text: `${item.qty}`, style: 'fonts', alignment: 'center' },
        {
          text: `${item.notes ? item.notes.toUpperCase() : ''} ${
            item.lite ? item.lite.NAME : ''
          }`,
          style: 'fontsBold',
        },
        {
          text: `${item.cab_number ? item.cab_number : ''}`,
          style: 'tableBold',
          alignment: 'center',
        },

        {
          text: `${(item.price / parseInt(item.qty)).toFixed(2)}`,
          style: 'fonts',
          alignment: 'right',
        },
        {
          text: `${item.price?.toFixed(2)}`,
          style: 'fonts',
          alignment: 'right',
          width: 210,
        },
      ]);
    });

    return [
      {
        id: 'parts',
        stack: [
          {
            margin: [0, 0, 0, 0],
            columns: [
              {
                stack: [
                  {
                    text: `${part.orderType ? part.orderType.name : ''}`,
                    style: 'fonts',
                  },
                  {
                    text: `${
                      part.thickness?.grade_name
                        ? part.thickness?.grade_name
                        : ''
                    }${part.woodtype.NAME} - ${part.thickness?.thickness_1} - ${
                      part.thickness?.thickness_2
                    }"`,
                    style: 'fonts',
                  },

                  {
                    text: `${
                      part?.construction?.value === 'Slab'
                        ? 'Slab'
                        : part.design
                        ? part.design.NAME
                        : part.face_frame_design
                        ? part.face_frame_design.NAME
                        : ''
                    } ${
                      part.construction.value === 'MT' ||
                      part.construction.value === 'Miter'
                        ? part.construction.value
                        : ''
                    } ${
                      part.profile?.NAME.includes('Deluxe') ? 'Deluxe' : ''
                    } - ${
                      part?.construction?.value === 'Slab'
                        ? ''
                        : part.panel
                        ? part.panel.NAME
                        : 'Glass'
                    }`,
                    style: 'fonts',
                  },
                ],
              },

              {
                width: 200,
                stack: [
                  {
                    text: `${part.notes ? part.notes.toUpperCase() : ''}`,
                    style: 'headerFont',
                    alignment: 'center',
                  },
                  part.applied_profile?.NAME !== 'None'
                    ? {
                        text: `${
                          part.applied_profile ? part.applied_profile.NAME : ''
                        }`,
                        style: 'headerFont',
                        alignment: 'center',
                      }
                    : null,
                ],
              },
              {
                stack: [
                  {
                    text: `IP:  ${
                      part.construction?.value === 'Slab'
                        ? 'None'
                        : (part.construction?.value === 'Cope' ||
                            part.design?.NAME?.includes('PRP 15') ||
                            part.design?.NAME?.includes('PRP15')) &&
                          part.profile
                        ? part.profile.NAME
                        : part.design
                        ? part.design.NAME
                        : 'None'
                    }   Edge:  ${part.edge ? part.edge.NAME : 'None'}`,
                    style: 'fonts',
                  },
                ],
                alignment: 'right',
              },
            ],
          },
          {
            text: '==============================================================================',
            alignment: 'center',
          },
          {
            table: {
              headerRows: 1,
              widths: [30, 100, 30, 155, '*', '*', '*'],
              body: tableBody,
            },

            layout: {
              hLineWidth: function (i, node) {
                return i === 1 ? 1 : 0;
              },
              vLineWidth: function (i, node) {
                return 0;
              },
              hLineStyle: function (i, node) {
                if (i === 0 || i === node.table.body.length) {
                  return null;
                }
                return { dash: { length: 1, space: 1 } };
              },
              paddingLeft: function (i) {
                return i === 0 ? 0 : 8;
              },
              paddingRight: function (i, node) {
                return i === node.table.widths.length - 1 ? 0 : 8;
              },
            },
          },
          {
            stack: [
              {
                columns: [
                  {
                    text: '-------',
                    margin: [164, 0, 0, 0],
                  },
                ],
                margin: [0, 0, 0, -10],
              },
              {
                columns: [
                  {
                    text: '------------',
                    margin: [0, 0, 0, 0],
                    alignment: 'right',
                  },
                ],
                margin: [0, 0, 0, -10],
              },
              {
                columns: [
                  {
                    text: '',
                    width: 120,
                  },
                  {
                    text: ' Total: ',
                    width: 55,
                    style: 'fonts',
                    alignment: 'left',
                  },
                  { text: `${qty[i]}`, style: 'fonts', alignment: 'left' },
                  {
                    margin: [14, 0, 0, 0],
                    columns: [
                      {
                        text: 'Item Subtotal',
                        style: 'fonts',
                        margin: [0, 0, 0, 0],
                        alignment: 'right',
                        width: 79,
                      },
                      {
                        text: `$${part.dimensions
                          .reduce(
                            (acc, item) =>
                              acc + Math.round(item.price * 100) / 100,
                            0
                          )
                          .toFixed(2)}`,
                        style: 'fonts',
                        margin: [0, 0, 0, 0],
                        alignment: 'right',
                        width: 77,
                      },
                    ],
                  },
                ],
                margin: [0, 10, 0, 5],
              },
            ],
          },
          // tableBody.length > 12 ? {
          //   text: '',
          //   pageBreak: 'after' // or after
          // } : null
        ],
      },

      {
        text: '==============================================================================',
        alignment: 'center',
      },
    ];
  });

  return [
    //table content here
    table_content,
    {
      id: 'misc',
      stack: [
        {
          columns: [
            {
              text: `Total Number of Pieces: ${qty.reduce(
                (acc, item) => acc + item,
                0
              )}`,
              style: 'fonts',
              width: 317,
            },
            {
              text: 'Order Subtotal',
              style: 'totals',
              margin: [0, 0, 0, 0],
              width: 120,
              alignment: 'right',
            },
            {
              text: `$${subTotal.toFixed(2)}`,
              style: 'fonts',
              margin: [0, 0, 0, 0],
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            { text: '', style: 'totals', width: 317 },
            {
              text: `${data.discount > 0 ? data.discount + '% Discount' : ''}`,
              style: 'totals',
              margin: [0, 0, 0, 0],
              alignment: 'right',
              width: 120,
            },
            {
              text: `${
                data.discount > 0 ? '- $' + discountTotal.toFixed(2) : ''
              }`,
              style: 'fonts',
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 0],
        },
        {
          text: '------------',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
        {
          columns: [
            { text: '', style: 'totals', width: 317 },
            {
              text: `${data.discount > 0 ? 'Discount Subtotal' : ''}`,
              style: 'totals',
              margin: [0, 0, 0, 0],
              width: 120,
              alignment: 'right',
            },
            {
              text: `${
                data.discount > 0 ? '$' + discountSubTotal.toFixed(2) : ''
              }`,
              style: 'fonts',
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 0],
        },
        data.misc_items.length > 0
          ? {
              columns: [
                {
                  text: `${
                    data.misc_items.length > 0 ? 'Miscellaneous Extra' : ''
                  }`,
                  style: 'fonts',
                  decoration: 'underline',
                  width: 168,
                },
                {
                  text: 'Qty',
                  style: 'fonts',
                  decoration: 'underline',
                  width: 33,
                },
                {
                  text: 'Cost Per',
                  style: 'fonts',
                  margin: [0, 0, 0, 0],
                  decoration: 'underline',
                },
                {
                  text: '',
                  style: 'totals',
                  margin: [0, 0, 0, 0],
                  alignment: 'right',
                },
              ],
              margin: [0, 10, 0, 0],
            }
          : null,
        data.misc_items.length > 0
          ? {
              columns: [
                {
                  text: data.misc_items.map((i) => {
                    return `${
                      i.item ? i.item.NAME : i.item2 ? i.item2 : ''
                    } \n`;
                  }),
                  style: 'fonts',
                  width: 171,
                },
                {
                  style: 'fonts',
                  stack: data.misc_items.map((i) => {
                    return { text: i.qty ? parseInt(i.qty) : '' };
                  }),
                  width: 30,
                },
                {
                  text: data.misc_items.map((i) => {
                    return `$${
                      i.price
                        ? parseFloat(i.price).toFixed(2)
                        : i.pricePer
                        ? parseFloat(i.pricePer).toFixed(2)
                        : 0
                    } \n`;
                  }),
                  style: 'fonts',
                  margin: [0, 0, 0, 0],
                },
                {
                  text: data.misc_items.map((i) => {
                    return `$${
                      i.price
                        ? (parseFloat(i.price) * parseFloat(i.qty)).toFixed(2)
                        : i.pricePer
                        ? (parseFloat(i.pricePer) * parseFloat(i.qty)).toFixed(
                            2
                          )
                        : 0
                    } \n`;
                  }),
                  style: 'fonts',
                  alignment: 'right',
                },
              ],
              margin: [0, 2, 0, 0],
            }
          : null,
        data.misc_items.length > 0
          ? {
              text: '------------',
              margin: [0, 0, 0, 0],
              alignment: 'right',
            }
          : null,
        data.misc_items.length > 0
          ? {
              columns: [
                {
                  text: '',
                  style: 'totals',
                  decoration: 'underline',
                  width: 317,
                },
                {
                  text: data.misc_items.length > 0 ? 'Order Sub Total' : '',
                  style: 'totals',
                  width: 120,
                  alignment: 'right',
                },
                {
                  text:
                    data.misc_items.length > 0
                      ? '$' + order_sub_total.toFixed(2)
                      : '',
                  style: 'fonts',
                  margin: [0, 0, 0, 0],
                  alignment: 'right',
                },
              ],
              margin: [0, 10, 0, 0],
            }
          : null,
        data.Taxable
          ? {
              columns: [
                { text: '', style: 'totals', width: 317 },
                {
                  text: data.Taxable
                    ? '$' +
                      order_sub_total.toFixed(2) +
                      ' x ' +
                      data.companyprofile.TaxRate +
                      '%' +
                      ' Tax:'
                    : '',
                  style: 'totals',
                  margin: [0, 0, 0, 4],
                  width: 120,
                  alignment: 'right',
                },
                {
                  text: `${
                    data.Taxable && tax > 0 ? '$' + tax.toFixed(2) : ''
                  }`,
                  style: 'fonts',
                  alignment: 'right',
                },
              ],
              margin: [0, 0, 0, 0],
            }
          : null,
        {
          text: '======',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
        {
          columns: [
            { text: '', style: 'totals', width: 317, decoration: 'underline' },
            {
              text: `${data.status === 'Quote' ? 'QUOTE ONLY' : 'TOTAL'}`,
              style: 'totals',
              margin: [0, 0, 0, 0],
              alignment: 'right',
              width: 120,
            },
            {
              text: `$${total.toFixed(2)}`,
              style: 'fonts',
              margin: [0, 0, 0, 0],
              alignment: 'right',
            },
          ],
          margin: [0, 10, 0, 0],
        },
        depositPaid > 0
          ? {
              columns: [
                {
                  text: '',
                  style: 'totals',
                  width: 317,
                  decoration: 'underline',
                },
                {
                  text: 'Minus Deposit Received:',
                  style: 'totals',
                  margin: [0, 0, 0, 0],
                  width: 120,
                  alignment: 'right',
                },
                {
                  text: `$${depositPaid.toFixed(2)}`,
                  style: 'fonts',
                  margin: [0, 0, 0, 0],
                  alignment: 'right',
                },
              ],
              margin: [0, 2, 0, 0],
            }
          : null,
        balancePaid > 0
          ? {
              columns: [
                {
                  text: '',
                  style: 'totals',
                  width: 317,
                  decoration: 'underline',
                },
                {
                  text: 'Minus Balance Paid:',
                  style: 'totals',
                  margin: [0, 0, 0, 0],
                  width: 120,
                  alignment: 'right',
                },
                {
                  text: `$${balancePaid.toFixed(2)}`,
                  style: 'fonts',
                  margin: [0, 0, 0, 0],
                  alignment: 'right',
                },
              ],
              margin: [0, 2, 0, 0],
            }
          : null,
        {
          text: '======',
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
        {
          columns: [
            { text: '', style: 'totals', width: 330 },
            {
              text: 'BALANCE DUE:',
              style: 'totals',
              margin: [0, 0, 0, 0],
              width: 105,
              alignment: 'right',
            },
            {
              text: `$${balanceDue.toFixed(2)}`,
              style: 'fonts',
              margin: [0, 0, 0, 0],
              alignment: 'right',
            },
          ],
          margin: [0, 10, 0, 5],
        },

        {
          stack: [
            {
              columns: [
                {
                  text: 'LIMITED WARRANTY',
                  decoration: 'underline',
                  style: 'fontsBold',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: `Units: ${qty.reduce((acc, item) => acc + item, 0)}`,
                  style: 'fonts',
                  alignment: 'right',
                  margin: [0, 0, 0, 0],
                },
              ],
            },

            {
              text: 'OUR PRODUCTS ARE WARRANTED FOR 1 YEAR FROM DATE OF SHIPMENT, WARRANTY DETAILS CAN FOUND AT \n HTTPS://PORTADOOR.COM AND IN OUR CATALOG \n \n LIABILITY UNDER THIS WARRANTY SHALL BE LIMITED TO THE ORIGINAL INVOICE PRICE OF THE PRODUCT',
              style: 'warrantyFont',
              alignment: 'left',
              margin: [0, 0, 0, 5],
              id: 'liability-acknowledgement',
            },
          ],
        },
      ],
    },
  ];
};

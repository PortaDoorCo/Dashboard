import { flatten } from 'lodash';

export default (data, breakdowns) => {
  const dim = data.part_list.map((i) => {
    return i.dimensions;
  });

  const flatten_d = flatten(dim);

  const amount = flatten_d.map((n) => parseInt(n.qty));
  const total = amount.reduce((acc, item) => acc + item, 0);

  const arr = [];
  const a = flatten(
    flatten_d.map((i) => {
      let obj = [];

      for (let p = 0; p < parseInt(i.qty); p++) {
        obj.push([
          {
            stack: [
              {
                text: `${
                  data.job_info &&
                  data.job_info.customer &&
                  data.job_info.customer.Company
                }`,
                alignment: 'center',
                style: 'fonts',
              },
              {
                text: `${data.job_info && data.job_info.poNum}`,
                alignment: 'center',
                style: 'fonts',
              },
              {
                text: `Order#: ${data.orderNum}`,
                alignment: 'center',
                style: 'fonts',
              },
              {
                text: `${i.width} x ${i.depth} x ${i.height}`,
                alignment: 'center',
                style: 'fonts',
              },
              {
                text: `Cab#: ${i.cab_number ? i.cab_number : ''}`,
                alignment: 'center',
                style: 'fonts',
              },
            ],
            margin: [0, 4, 0, 0],
          },
        ]);
      }

      return obj;
    })
  );

  function splitArrayIntoChunksOfLen(arr, len) {
    var chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
  }

  const newChunk = splitArrayIntoChunksOfLen(a, 3);

  const lastArr = newChunk[newChunk.length - 1].length;


  if (lastArr !== 3) {
    for (let i = 0; i < 3 - lastArr; i++) {
      newChunk[newChunk.length - 1].push({ text: '', alignment: 'center', margin: [0, 5, 0, 0] });
    }
  }

  return [
    {
      margin: [-21, -7, -5, 8],
      table: {
        alignment: 'center',
        widths: [175, 182, 180],
        heights: [65, 70, 70, 72, 71, 71, 70, 69, 69, 60],
        body: newChunk,
      },
      layout: {
        hLineWidth: function (i, node) {
          return i === 1 ? 0 : 0;
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
        // paddingLeft: function(i, node) { return 10; },
        // paddingRight: function(i, node) { return 5; },
        paddingTop: function (i, node) {
          return 7;
        },
        paddingBottom: function (i, node) {
          return -0.5;
        },
      },
    },
  ];
};

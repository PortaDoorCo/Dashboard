import { createSelector } from 'reselect';
import numQty from 'numeric-quantity';


const pricingSelector = state => {
  const pricing = state.part_list.pricing ? state.part_list.pricing[0] : 0;
  return pricing;
};

const discountSelector = state => {
  const orders = state.form.DoorOrder;

  if (orders) {
    if ((!state.form.DoorOrder.values && !state.form.DoorOrder.values.discount)) {
      return 0;
    } else {
      if(state.form.DoorOrder.values.discount>0){
        return (numQty(state.form.DoorOrder.values.discount) / 100);
      } else {
        return 0;
      }
      
    }
  } else {
    return 0;
  }
};

const partListSelector = state => {
  const orders = state.form.DoorOrder;

  if (orders) {
    if ((!state.form.DoorOrder.values && !state.form.DoorOrder.values.part_list)) {
      return [];
    } else {
      return state.form.DoorOrder.values.part_list;
    }
  } else {
    return [];
  }
};

const miscItemsSelector = state => {
  const orders = state.form.DoorOrder;
  if (orders) {
    if ((!state.form.DoorOrder.values && !state.form.DoorOrder.values.misc_items.length > 0)) {
      return [];
    } else {
      return state.form.DoorOrder.values.misc_items.map(i => {
        if(i.price) {
          return parseFloat(i.price);
        }
        if(i.price2){
          return parseFloat(i.price2) * parseInt(i.qty);
        }
        else {
          return 0;
        }
        
      });
    }
  } else {
    return [];
  }
};

const taxRate = state => {
  const orders = state.form.DoorOrder;

  if (orders) {
    if (!orders.values.job_info) {
      return 0;
    } else {
      if(state.form && state.form.DoorOrder && state.form.DoorOrder.values && state.form.DoorOrder.values.Taxable){
        return (state.form.DoorOrder.values.job_info.customer.TaxRate / 100);
      } else {
        return 0;
      }
    }
  } else {
    return 0;
  }
};

const totalBalanceDue = state => {
  const orders = state.form.DoorOrder;
  if (orders) {
    if (!orders && !orders.values && !orders.values.balance_history) {
      return [];
    } else {
      return state.form.DoorOrder.values.balance_history.map(i => {
        return i.balance_paid;
      });
    }
  } else {
    return [];
  }
};



export const itemPriceSelector = createSelector(
  [partListSelector, pricingSelector],
  (parts, pricer) =>
    parts.map((part, index) => {

      let design = 0;

      if (part.cope_design) {
        design = part.cope_design && part.thickness.value === 0.75 ? part.cope_design.UPCHARGE : (part.cope_design && part.thickness.value === 1) ? part.cope_design.UPCHARGE_THICK : 0;
      }

      if (part.miter_design) {
        design = part.miter_design && part.thickness.value === 0.75 ? part.miter_design.UPCHARGE : (part.miter_design && part.thickness.value === 1) ? part.miter_design.UPCHARGE_THICK : 0;
      }

      if (part.mt_design) {
        design = part.mt_design && part.thickness.value === 0.75 ? part.mt_design.UPCHARGE : (part.mt_design && part.thickness.value === 1) ? part.mt_design.UPCHARGE_THICK : 0;
      }

      if (part.miter_df_design) {
        design = part.miter_df_design && part.thickness.value === 0.75 ? part.miter_df_design.UPCHARGE : (part.miter_df_design && part.thickness.value === 1) ? part.miter_df_design.UPCHARGE_THICK : 0;
      }

      if (part.mt_df_design) {
        design = part.mt_df_design && part.thickness.value === 0.75 ? part.mt_df_design.UPCHARGE : (part.mt_df_design && part.thickness.value === 1) ? part.mt_df_design.UPCHARGE_THICK : 0;
      }

      const wood = part.woodtype && part.thickness.value === 0.75 ? part.woodtype.STANDARD_GRADE : (part.woodtype && part.thickness.value === 1) ? part.woodtype.STANDARD_GRADE_THICK : 0;
      // const design = part.design && part.thickness.value === 0.75 ? part.design.UPCHARGE : (part.design && part.thickness.value === 1) ? part.design.UPCHARGE_THICK :  0;
      const edge = part.edge ? part.edge.UPCHARGE : 0;
      const panel = part.panel ? part.panel.UPCHARGE : 0;
      const applied_profile = part.applied_profile ? part.applied_profile.UPCHARGE : 0;
      const finish = part.finish ? part.finish.UPCHARGE : 0;
      const lites = part.lites ? part.lites.UPCHARGE : 0;
      const ff_opening_cost = part.design && part.orderType.value === 'Face_Frame' ? part.design.opening_cost : 0;
      const ff_top_rail_design = part.face_frame_top_rail ? part.face_frame_top_rail.UPCHARGE : 0;
      const furniture_feet = part.furniture_feet ? part.furniture_feet.UPCHARGE : 0;



      if (part.orderType.value === 'Face_Frame') {
        if (part.dimensions) {
          const linePrice = part.dimensions.map(i => {

            const width = Math.ceil(numQty(i.width));
            const height = Math.ceil(numQty(i.height));
            const openings = parseInt(i.openings);
            const qty = parseInt(i.qty);
            const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;

            const price = (eval(pricer.face_frame_pricing) + extraCost)
              || 0;

            if (height > -1) {
              return price;
            } else {
              return 0;
            }
          });

          return linePrice;
        } else {
          return 0;
        }
      } else {
        if (part.dimensions) {
          const linePrice = part.dimensions.map(i => {
            const width = Math.ceil(numQty(i.width));
            const height = Math.ceil(numQty(i.height));
            const qty = parseInt(i.qty);
            const extraCost = i.extraCost ? parseFloat(i.extraCost) : 0;


            let leftStileAdd = 0;
            let rightStileAdd = 0;
            let topRailAdd = 0;
            let bottomRailAdd = 0;

            const calcPrice = (add, part, price, w) => {
              const width = w;
              const difference = numQty(part) - width;
              const calc = difference * 10 + price;
              const priceDifference = calc - price;
              return (add = priceDifference / 4);
            };
  
            const leftStileCalc = (p) => {
              return calcPrice(eval('leftStileAdd'), eval('i.leftStile'), eval('price'), p);
            };
  
            const rightStileCalc = (p) => {
              return calcPrice(eval('rightStileAdd'), eval('i.rightStile'), eval('price'), p);
            };
  
            const topRailCalc = (p) => {
              return calcPrice(eval('topRailAdd'), eval('i.topRail'), eval('price'), p);
            };
  
            const bottomRailCalc = (p) => {
              return calcPrice(eval('bottomRailAdd'), eval('i.bottomRail'), eval('price'), p);
            };
  
            const calc = (part, design) => {
              switch (part) {
                case 'leftStile':
                  leftStileCalc(design);
                  break;
                case 'rightStile':
                  rightStileCalc(design);
                  break;
                case 'topRail':
                  topRailCalc(design);
                  break;
                case 'bottomRail':
                  bottomRailCalc(design);
                  break;
                default:
                  return 0;
              }
            };

            
            if (part.construction.value === 'Cope') {
              if ((part.orderType.value === 'DF') || (part.orderType.value === 'Glass_DF')) {

                let price = 0;

                if (part.thickness.value === 0.75) {
                  price = 10;
                }
                if (part.thickness.value === 1) {
                  price = 18;
                }

                //leftStile
                if (part.profile && part.profile.MINIMUM_STILE_WIDTH !== numQty(i.leftStile)) {
                  calc('leftStile', part.profile.MINIMUM_STILE_WIDTH);
                }
                //rightStile
                if (part.profile && part.profile.MINIMUM_STILE_WIDTH !== numQty(i.rightStile)) {
                  calc('rightStile', part.profile.MINIMUM_STILE_WIDTH);

                }
                //topRail
                if (part.profile && part.profile.MINIMUM_STILE_WIDTH !== numQty(i.topRail)) {
                  calc('topRail', part.profile.MINIMUM_STILE_WIDTH);
                }
                //bottomRail
                if (part.profile &&  part.profile.MINIMUM_STILE_WIDTH !== numQty(i.bottomRail)) {
                  calc('bottomRail', part.profile.MINIMUM_STILE_WIDTH);
                }


              } else {

                let price = 0;

                if (part.thickness.value === 0.75) {
                  price = part.cope_design.UPCHARGE;
                }
                if (part.thickness.value === 1) {
                  price = part.cope_design.UPCHARGE_THICK;
                }

                //leftStile
                if (part.profile && part.profile.MINIMUM_STILE_WIDTH !== numQty(i.leftStile)) {
                  calc('leftStile', part.profile.MINIMUM_STILE_WIDTH);
                }
                //rightStile
                if (part.profile && part.profile.MINIMUM_STILE_WIDTH !== numQty(i.rightStile)) {
                  calc('rightStile', part.profile.MINIMUM_STILE_WIDTH);
                }
                //topRail
                if (part.profile && part.profile.MINIMUM_STILE_WIDTH !== numQty(i.topRail)) {
                  calc('topRail', part.profile.MINIMUM_STILE_WIDTH);
                }
                //bottomRail
                if (part.profile && part.profile.MINIMUM_STILE_WIDTH !== numQty(i.bottomRail)) {
                  calc('bottomRail', part.profile.MINIMUM_STILE_WIDTH);
                }
              }

            }

            if (part.construction.value === 'M') {

              if ((part.orderType.value === 'DF') || (part.orderType.value === 'Glass_DF')) {
                let price = 0;

                if (part.thickness.value === 0.75) {
                  price = part.miter_df_design.UPCHARGE;
                }
                if (part.thickness.value === 1) {
                  price = part.miter_df_design.UPCHARGE_THICK;
                }

                //leftStile
                if (part.miter_df_design && part.miter_df_design.PROFILE_WIDTH !== numQty(i.leftStile)) {
                  calc('leftStile', part.miter_df_design.PROFILE_WIDTH);
                }
                //rightStile
                if (part.miter_df_design && part.miter_df_design.PROFILE_WIDTH !== numQty(i.rightStile)) {
                  calc('rightStile', part.miter_df_design.PROFILE_WIDTH);
                }
                //topRail
                if (part.miter_df_design && part.miter_df_design.PROFILE_WIDTH !== numQty(i.topRail)) {
                  calc('topRail', part.miter_df_design.PROFILE_WIDTH);
                }
                //bottomRail
                if (part.miter_df_design && part.miter_df_design.PROFILE_WIDTH !== numQty(i.bottomRail)) {
                  calc('bottomRail', part.miter_df_design.PROFILE_WIDTH);
                }
              } else {

                let price = 0;

                if (part.thickness.value === 0.75) {
                  price = part.miter_design.UPCHARGE;
                }
                if (part.thickness.value === 1) {
                  price = part.miter_design.UPCHARGE_THICK;
                }

                //leftStile
                if (part.miter_design && part.miter_design.PROFILE_WIDTH !== numQty(i.leftStile)) {
                  calc('leftStile', part.miter_design.PROFILE_WIDTH);
                }
                //rightStile
                if (part.miter_design && part.miter_design.PROFILE_WIDTH !== numQty(i.rightStile)) {
                  calc('rightStile', part.miter_design.PROFILE_WIDTH);
                }
                //topRail
                if (part.miter_design && part.miter_design.PROFILE_WIDTH !== numQty(i.topRail)) {
                  calc('topRail', part.miter_design.PROFILE_WIDTH);
                }
                //bottomRail
                if (part.miter_design && part.miter_design.PROFILE_WIDTH !== numQty(i.bottomRail)) {
                  calc('bottomRail', part.miter_design.PROFILE_WIDTH);
                } 
              }


            }

            if (part.construction.value === 'MT') {
              let price = 0;

              if (part.thickness.value === 0.75) {
                price = part.mt_design.UPCHARGE;
              }
              if (part.thickness.value === 1) {
                price = part.mt_design.UPCHARGE_THICK;
              }

              //leftStile
              if (part.mt_design && part.mt_design.MID_RAIL_MINIMUMS !== numQty(i.leftStile)) {
                calc('leftStile', part.mt_design.MID_RAIL_MINIMUMS);
              }
              //rightStile
              if (part.mt_design &&  part.mt_design.MID_RAIL_MINIMUMS !== numQty(i.rightStile)) {
                calc('rightStile', part.mt_design.MID_RAIL_MINIMUMS);
              }
              //topRail
              if (part.mt_design && part.mt_design.MID_RAIL_MINIMUMS !== numQty(i.topRail)) {
                calc('topRail', part.mt_design.MID_RAIL_MINIMUMS);
              }
              //bottomRail
              if (part.mt_design && part.mt_design.MID_RAIL_MINIMUMS !== numQty(i.bottomRail)) {
                calc('bottomRail', part.mt_design.MID_RAIL_MINIMUMS);
              }
            }

            let price = 0;

            if ((part.orderType.value === 'DF') || (part.orderType.value === 'Glass_DF')){
              price = (eval(pricer.df_pricing) + leftStileAdd + rightStileAdd + topRailAdd + bottomRailAdd + extraCost) ? (eval(pricer.df_pricing) + leftStileAdd + rightStileAdd + topRailAdd + bottomRailAdd + extraCost) : 0;
            } else {
              price = (eval(pricer.door_pricing) + leftStileAdd + rightStileAdd + topRailAdd + bottomRailAdd + extraCost) ? (eval(pricer.door_pricing) + leftStileAdd + rightStileAdd + topRailAdd + bottomRailAdd + extraCost) : 0;
            }
            if (height > -1) {
              return price;
            } else {
              return 0;
            }
          });
          return linePrice;
        } else {
          return 0;
        }
      }
    })
);


export const linePriceSelector = createSelector(
  [partListSelector, pricingSelector, itemPriceSelector],
  (parts, pricer, item) =>
    parts.map((part, index) => {
      if(part.dimensions){
        return part.dimensions.map((i, p) => {
          console.log(item[index][p]);
          if(item[index][p]){
            if(i.qty){
              return item[index][p] * parseInt(i.qty);
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        });
      } else {
        return 0;
      }
    })
);

export const addPriceSelector = createSelector(
  [partListSelector],
  (parts) =>
    parts.map((part, index) => {
      if (part.addPrice) {
        return parseFloat(part.addPrice);
      } else {
        return 0;
      }
    })
);

export const miscTotalSelector = createSelector(
  [miscItemsSelector],
  (misc) => (misc.reduce((acc, item) => acc + item, 0))
);



export const subTotalSelector = createSelector(
  [linePriceSelector, addPriceSelector, miscTotalSelector],
  (prices, add, misc) =>
    prices.map((i, index) => {
      if (i) {
        let price = parseFloat(i.reduce((acc, item) => acc + item, 0));
        let sum = price += add[index];
        return sum;
      } else {
        return 0;
      }
    })
);

export const subTotal_Total = createSelector(
  [subTotalSelector, miscTotalSelector],
  (subTotal, misc) => subTotal.reduce((acc, item) => acc + item, 0)
);

export const taxSelector = createSelector(
  [subTotalSelector, taxRate],
  (subTotal, tax) => (subTotal.reduce((acc, item) => acc + item, 0) * tax)
);

export const totalDiscountSelector = createSelector(
  [subTotalSelector, miscTotalSelector, discountSelector],
  (subTotal, misc, discount) => {
    return (subTotal.reduce((acc, item) => acc + item, 0) + misc) * discount;
  }
);

export const totalSelector = createSelector(
  [subTotalSelector, taxSelector, miscTotalSelector, totalDiscountSelector],
  (subTotal, tax, misc, discount) => {
    return subTotal.reduce((acc, item) => acc + item, 0) + tax + misc - discount;
  }
);


export const balanceTotalSelector = createSelector(
  [totalBalanceDue],
  (balance) => balance.reduce((acc, item) => acc + item, 0)
);

export const balanceSelector = createSelector(
  [totalSelector, balanceTotalSelector],
  (total, balance) => total - balance
);
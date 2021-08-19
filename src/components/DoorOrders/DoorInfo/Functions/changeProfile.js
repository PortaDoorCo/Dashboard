
import fraction from '../../../../utils/fraction';

const changeProfile = (p, ind, props, change) => {

  const { formState, dispatch } = props;

  

  const part = formState.part_list[ind];





  if(part?.orderType?.value === 'DF'){

    dispatch(
      change('DoorOrder', `${p}.notes`, `Left Stile: ${fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)}" Right Stile: ${fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)}" \nTop Rail: ${fraction(part.profile ? part.profile.DF_Reduction : 0)} Bottom Rail: ${fraction(part.profile ? part.profile.DF_Reduction : 0)}"`)
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.leftStile`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.rightStile`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.topRail`,
        fraction(part.profile ? (part.profile.DF_Reduction) : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.bottomRail`,
        fraction(part.profile ? (part.profile.DF_Reduction) : 0)
      )
    );
  } else {

    dispatch(
      change('DoorOrder', `${p}.notes`, `Left Stile: ${fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)}" Right Stile: ${fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)}" \nTop Rail: ${fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)} Bottom Rail: ${fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)}"`)
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.leftStile`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.rightStile`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.topRail`,
        fraction(part.profile ? (part.profile.PROFILE_WIDTH) : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.bottomRail`,
        fraction(part.profile ? (part.profile.PROFILE_WIDTH) : 0)
      )
    );
  }


  


  if(part.dimensions){
    part.dimensions.forEach((info, index) => {
      if(info){


        if(part?.orderType?.value === 'DF'){
          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].leftStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].rightStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );


          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].topRail`,
              fraction(part.profile ? (part.profile.DF_Reduction) : 0)
            )
          );


          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].bottomRail`,
              fraction(part.profile ? (part.profile.DF_Reduction) : 0)
            )
          );


          if (parseInt(info.panelsH) > 1) {
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].horizontalMidRailSize`,
                fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
              )
            );
          } 


          if (parseInt(info.panelsW) > 1) {
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].verticalMidRailSize`,
                fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
              )
            );
          }
        } else {
          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].leftStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.leftStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].rightStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );


          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].topRail`,
              fraction(part.profile ? (part.profile.PROFILE_WIDTH) : 0)
            )
          );


          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].bottomRail`,
              fraction(part.profile ? (part.profile.PROFILE_WIDTH) : 0)
            )
          );


          if (parseInt(info.panelsH) > 1) {
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].horizontalMidRailSize`,
                fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
              )
            );
          } 


          if (parseInt(info.panelsW) > 1) {
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].verticalMidRailSize`,
                fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
              )
            );
          }
        }


      } else {
        return null;
      }
    });
  } else {
    return null;
  }
};

export default changeProfile;